const { User, Profile, Job, Contract, Payment, Transaction, SupportTicket, Category, Skill } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalBuyers = await User.count({ where: { role: 'buyer' } });
    const totalFreelancers = await User.count({ where: { role: 'freelancer' } });
    const totalJobs = await Job.count();
    const activeJobs = await Job.count({ where: { status: { [Op.in]: ['posted', 'bidding', 'hired', 'in_progress'] } } });
    const totalContracts = await Contract.count();
    const activeContracts = await Contract.count({ where: { status: 'active' } });

    // Revenue stats
    const totalRevenue = await Payment.sum('platformFee', {
      where: { status: 'completed' }
    }) || 0;

    const monthlyRevenue = await Payment.sum('platformFee', {
      where: {
        status: 'completed',
        createdAt: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 1))
        }
      }
    }) || 0;

    // User growth (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const userGrowth = await User.findAll({
      attributes: [
        [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'month'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        createdAt: { [Op.gte]: sixMonthsAgo }
      },
      group: [sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE_TRUNC', 'month', sequelize.col('createdAt')), 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          buyers: totalBuyers,
          freelancers: totalFreelancers
        },
        jobs: {
          total: totalJobs,
          active: activeJobs
        },
        contracts: {
          total: totalContracts,
          active: activeContracts
        },
        revenue: {
          total: parseFloat(totalRevenue),
          monthly: parseFloat(monthlyRevenue)
        },
        userGrowth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getUsers = async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    const where = {};
    if (role) where.role = role;
    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const users = await User.findAndCountAll({
      where,
      include: [{
        model: Profile,
        as: 'profile'
      }],
      attributes: { exclude: ['password', 'twoFactorSecret'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: users.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: users.count,
        pages: Math.ceil(users.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify KYC
// @route   PUT /api/admin/users/:id/verify-kyc
// @access  Private (Admin)
exports.verifyKYC = async (req, res) => {
  try {
    const { isKYCVerified } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isKYCVerified = isKYCVerified;
    await user.save();

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all support tickets
// @route   GET /api/admin/support-tickets
// @access  Private (Admin)
exports.getSupportTickets = async (req, res) => {
  try {
    const { status, priority, page = 1, limit = 20 } = req.query;
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const tickets = await SupportTicket.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'email'],
        include: [{
          model: Profile,
          as: 'profile',
          attributes: ['displayName', 'avatar']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: tickets.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: tickets.count,
        pages: Math.ceil(tickets.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update support ticket
// @route   PUT /api/admin/support-tickets/:id
// @access  Private (Admin)
exports.updateSupportTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    await ticket.update(req.body);

    res.status(200).json({
      success: true,
      data: ticket
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all categories
// @route   GET /api/admin/categories
// @access  Private (Admin)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create category
// @route   POST /api/admin/categories
// @access  Private (Admin)
exports.createCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

