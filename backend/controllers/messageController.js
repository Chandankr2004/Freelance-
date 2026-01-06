const { Message, User, Profile, Contract } = require('../models');
const { Op } = require('sequelize');

// @desc    Get conversations
// @route   GET /api/messages/conversations
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const conversations = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: req.user.id },
          { receiverId: req.user.id }
        ]
      },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        },
        {
          model: Contract,
          as: 'contract',
          attributes: ['id', 'title']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    // Group by conversation partner
    const conversationMap = new Map();
    conversations.forEach(msg => {
      const partnerId = msg.senderId === req.user.id ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          partner: msg.senderId === req.user.id ? msg.receiver : msg.sender,
          lastMessage: msg,
          unreadCount: 0
        });
      }
    });

    // Count unread messages
    for (const [partnerId, conv] of conversationMap) {
      const unread = await Message.count({
        where: {
          senderId: partnerId,
          receiverId: req.user.id,
          isRead: false
        }
      });
      conv.unreadCount = unread;
    }

    res.status(200).json({
      success: true,
      data: Array.from(conversationMap.values())
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get messages with a user
// @route   GET /api/messages/:userId
// @access  Private
exports.getMessages = async (req, res) => {
  try {
    const { contractId, page = 1, limit = 50 } = req.query;
    const where = {
      [Op.or]: [
        { senderId: req.user.id, receiverId: req.params.userId },
        { senderId: req.params.userId, receiverId: req.user.id }
      ]
    };

    if (contractId) {
      where.contractId = contractId;
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const messages = await Message.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'email'],
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        }
      ],
      order: [['createdAt', 'ASC']],
      limit: parseInt(limit),
      offset
    });

    // Mark messages as read
    await Message.update(
      { isRead: true, readAt: new Date() },
      {
        where: {
          senderId: req.params.userId,
          receiverId: req.user.id,
          isRead: false
        }
      }
    );

    res.status(200).json({
      success: true,
      data: messages.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: messages.count,
        pages: Math.ceil(messages.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Send message
// @route   POST /api/messages
// @access  Private
exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content, contractId, attachments } = req.body;

    const message = await Message.create({
      senderId: req.user.id,
      receiverId,
      contractId: contractId || null,
      content,
      attachments: attachments || []
    });

    const messageWithDetails = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        },
        {
          model: Contract,
          as: 'contract',
          attributes: ['id', 'title']
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: messageWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

