const { Contract, Milestone, Job, User, Profile, Payment, Transaction } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all contracts
// @route   GET /api/contracts
// @access  Private
exports.getContracts = async (req, res) => {
  try {
    const { status, role } = req.query;
    const where = {};

    if (role === 'buyer') {
      where.buyerId = req.user.id;
    } else if (role === 'freelancer') {
      where.freelancerId = req.user.id;
    } else {
      where[Op.or] = [
        { buyerId: req.user.id },
        { freelancerId: req.user.id }
      ];
    }

    if (status) {
      where.status = status;
    }

    const contracts = await Contract.findAll({
      where,
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        },
        {
          model: User,
          as: 'freelancer',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        },
        {
          model: Job,
          as: 'job',
          attributes: ['id', 'title', 'categoryId']
        },
        {
          model: Milestone,
          as: 'milestones',
          order: [['order', 'ASC']]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: contracts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single contract
// @route   GET /api/contracts/:id
// @access  Private
exports.getContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'buyer',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        },
        {
          model: User,
          as: 'freelancer',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        },
        {
          model: Job,
          as: 'job'
        },
        {
          model: Milestone,
          as: 'milestones',
          order: [['order', 'ASC']]
        }
      ]
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    // Check authorization
    if (contract.buyerId !== req.user.id && contract.freelancerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this contract'
      });
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create milestones
// @route   POST /api/contracts/:id/milestones
// @access  Private
exports.createMilestones = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id);

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    if (contract.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to create milestones'
      });
    }

    const { milestones } = req.body;
    const createdMilestones = [];

    for (let i = 0; i < milestones.length; i++) {
      const milestone = await Milestone.create({
        ...milestones[i],
        contractId: contract.id,
        order: i + 1
      });
      createdMilestones.push(milestone);
    }

    res.status(201).json({
      success: true,
      data: createdMilestones
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update milestone status
// @route   PUT /api/milestones/:id
// @access  Private
exports.updateMilestone = async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id, {
      include: [{
        model: Contract,
        as: 'contract'
      }]
    });

    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: 'Milestone not found'
      });
    }

    const contract = milestone.contract;
    const isBuyer = contract.buyerId === req.user.id;
    const isFreelancer = contract.freelancerId === req.user.id;

    if (!isBuyer && !isFreelancer && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Freelancer can mark as completed
    if (req.body.status === 'completed' && isFreelancer) {
      milestone.status = 'completed';
      milestone.completedDate = new Date();
    }
    // Buyer can approve or reject
    else if ((req.body.status === 'approved' || req.body.status === 'rejected') && isBuyer) {
      milestone.status = req.body.status;
    }

    await milestone.save();

    res.status(200).json({
      success: true,
      data: milestone
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Complete contract
// @route   PUT /api/contracts/:id/complete
// @access  Private
exports.completeContract = async (req, res) => {
  try {
    const contract = await Contract.findByPk(req.params.id, {
      include: [{
        model: Milestone,
        as: 'milestones'
      }]
    });

    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    if (contract.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Only buyer can complete the contract'
      });
    }

    // Check if all milestones are approved
    const allApproved = contract.milestones.every(m => m.status === 'approved');
    if (!allApproved && contract.milestones.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'All milestones must be approved before completing the contract'
      });
    }

    contract.status = 'completed';
    contract.completedDate = new Date();
    await contract.save();

    // Update job status
    const job = await Job.findByPk(contract.jobId);
    if (job) {
      job.status = 'completed';
      await job.save();
    }

    res.status(200).json({
      success: true,
      data: contract
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

