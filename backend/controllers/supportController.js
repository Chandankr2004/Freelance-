const { SupportTicket, User, Profile } = require('../models');

// @desc    Create support ticket
// @route   POST /api/support
// @access  Private
exports.createTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.create({
      ...req.body,
      userId: req.user.id
    });

    const ticketWithDetails = await SupportTicket.findByPk(ticket.id, {
      include: [{
        model: User,
        as: 'user',
        include: [{
          model: Profile,
          as: 'profile'
        }]
      }]
    });

    res.status(201).json({
      success: true,
      data: ticketWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user tickets
// @route   GET /api/support/my-tickets
// @access  Private
exports.getMyTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: tickets
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single ticket
// @route   GET /api/support/:id
// @access  Private
exports.getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'user',
        include: [{
          model: Profile,
          as: 'profile'
        }]
      }]
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found'
      });
    }

    if (ticket.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

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

