const { Bid, Job, User, Profile, Contract } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all bids for a job
// @route   GET /api/jobs/:jobId/bids
// @access  Private
exports.getJobBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { jobId: req.params.jobId },
      include: [{
        model: User,
        as: 'freelancer',
        attributes: ['id', 'email'],
        include: [{
          model: Profile,
          as: 'profile',
          attributes: ['displayName', 'avatar', 'rating', 'jobSuccessScore', 'totalJobs']
        }]
      }],
      order: [['amount', 'ASC'], ['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create bid
// @route   POST /api/jobs/:jobId/bids
// @access  Private (Freelancer)
exports.createBid = async (req, res) => {
  try {
    if (req.user.role !== 'freelancer') {
      return res.status(403).json({
        success: false,
        message: 'Only freelancers can place bids'
      });
    }

    const job = await Job.findByPk(req.params.jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.status !== 'posted' && job.status !== 'bidding') {
      return res.status(400).json({
        success: false,
        message: 'Job is not accepting bids'
      });
    }

    // Check if user already bid
    const existingBid = await Bid.findOne({
      where: {
        jobId: req.params.jobId,
        freelancerId: req.user.id
      }
    });

    if (existingBid) {
      return res.status(400).json({
        success: false,
        message: 'You have already placed a bid on this job'
      });
    }

    const bid = await Bid.create({
      ...req.body,
      jobId: req.params.jobId,
      freelancerId: req.user.id
    });

    // Update job bids count
    job.bidsCount += 1;
    if (job.status === 'posted') {
      job.status = 'bidding';
    }
    await job.save();

    const bidWithDetails = await Bid.findByPk(bid.id, {
      include: [{
        model: User,
        as: 'freelancer',
        include: [{
          model: Profile,
          as: 'profile'
        }]
      }]
    });

    res.status(201).json({
      success: true,
      data: bidWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Accept bid
// @route   PUT /api/bids/:id/accept
// @access  Private (Buyer/Job Owner)
exports.acceptBid = async (req, res) => {
  try {
    const bid = await Bid.findByPk(req.params.id, {
      include: [{
        model: Job,
        as: 'job'
      }]
    });

    if (!bid) {
      return res.status(404).json({
        success: false,
        message: 'Bid not found'
      });
    }

    if (bid.job.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this bid'
      });
    }

    if (bid.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Bid is not in pending status'
      });
    }

    // Update bid status
    bid.status = 'accepted';
    await bid.save();

    // Reject other bids
    await Bid.update(
      { status: 'rejected' },
      {
        where: {
          jobId: bid.jobId,
          id: { [Op.ne]: bid.id },
          status: 'pending'
        }
      }
    );

    // Update job
    const job = await Job.findByPk(bid.jobId);
    job.status = 'hired';
    job.hiredFreelancerId = bid.freelancerId;
    await job.save();

    // Create contract
    const platformFeePercent = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || 10);
    const platformFee = (bid.amount * platformFeePercent) / 100;
    const freelancerAmount = bid.amount - platformFee;

    const contract = await Contract.create({
      jobId: bid.jobId,
      buyerId: job.buyerId,
      freelancerId: bid.freelancerId,
      title: job.title,
      description: job.description,
      totalAmount: bid.amount,
      currency: bid.currency,
      platformFee,
      freelancerAmount,
      contractType: job.budgetType,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(200).json({
      success: true,
      data: {
        bid,
        contract
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user bids
// @route   GET /api/bids/my-bids
// @access  Private (Freelancer)
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Bid.findAll({
      where: { freelancerId: req.user.id },
      include: [{
        model: Job,
        as: 'job',
        include: [{
          model: User,
          as: 'buyer',
          include: [{
            model: Profile,
            as: 'profile'
          }]
        }]
      }],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: bids
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

