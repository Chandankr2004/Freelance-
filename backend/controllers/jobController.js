const { Job, User, Category, Bid, Profile, sequelize } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      search,
      minBudget,
      maxBudget,
      budgetType,
      location,
      isRemote,
      status
    } = req.query;

    const where = {};
    if (category) where.categoryId = category;
    if (status) where.status = status;
    if (isRemote !== undefined) where.isRemote = isRemote === 'true';
    if (location) where.location = { [Op.iLike]: `%${location}%` };
    if (minBudget || maxBudget) {
      where.budget = {};
      if (minBudget) where.budget[Op.gte] = parseFloat(minBudget);
      if (maxBudget) where.budget[Op.lte] = parseFloat(maxBudget);
    }
    if (budgetType) where.budgetType = budgetType;
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar', 'rating']
          }]
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: jobs.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: jobs.count,
        pages: Math.ceil(jobs.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar', 'rating', 'totalJobs']
          }]
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug']
        },
        {
          model: Bid,
          as: 'bids',
          include: [{
            model: User,
            as: 'freelancer',
            attributes: ['id', 'email'],
            include: [{
              model: Profile,
              as: 'profile',
              attributes: ['displayName', 'avatar', 'rating', 'jobSuccessScore']
            }]
          }],
          order: [['amount', 'ASC']]
        }
      ]
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Increment views
    job.views += 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create job
// @route   POST /api/jobs
// @access  Private (Buyer)
exports.createJob = async (req, res) => {
  try {
    if (req.user.role !== 'buyer') {
      return res.status(403).json({
        success: false,
        message: 'Only buyers can post jobs'
      });
    }

    const job = await Job.create({
      ...req.body,
      buyerId: req.user.id
    });

    const jobWithDetails = await Job.findByPk(job.id, {
      include: [
        {
          model: Category,
          as: 'category'
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: jobWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Buyer/Owner)
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    await job.update(req.body);

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Buyer/Owner or Admin)
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findByPk(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    if (job.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.destroy();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

