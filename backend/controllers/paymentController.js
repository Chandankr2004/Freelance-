const { Payment, Transaction, Contract, User, Profile } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Create payment (escrow)
// @route   POST /api/payments
// @access  Private
exports.createPayment = async (req, res) => {
  try {
    const { contractId, amount, paymentMethod, paymentGateway } = req.body;

    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    if (contract.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    // Calculate platform fee
    const platformFeePercent = parseFloat(process.env.PLATFORM_FEE_PERCENTAGE || 10);
    const platformFee = (amount * platformFeePercent) / 100;
    const freelancerAmount = amount - platformFee;

    const payment = await Payment.create({
      contractId,
      payerId: contract.buyerId,
      receiverId: contract.freelancerId,
      amount,
      currency: contract.currency,
      platformFee,
      paymentMethod,
      paymentGateway,
      paymentType: 'escrow',
      status: 'pending'
    });

    // Update contract
    contract.escrowAmount = (parseFloat(contract.escrowAmount) || 0) + parseFloat(amount);
    contract.paymentStatus = 'escrowed';
    await contract.save();

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Process payment
// @route   POST /api/payments/:id/process
// @access  Private (Admin or Payment Gateway Webhook)
exports.processPayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{
        model: Contract,
        as: 'contract'
      }]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    // In production, verify payment with payment gateway here
    // For now, we'll simulate successful payment

    payment.status = 'completed';
    payment.transactionId = req.body.transactionId || `TXN-${Date.now()}`;
    await payment.save();

    // Create transaction records
    const t = await sequelize.transaction();

    try {
      // Debit from buyer
      await Transaction.create({
        userId: payment.payerId,
        paymentId: payment.id,
        type: 'debit',
        amount: payment.amount,
        currency: payment.currency,
        balance: 0, // Calculate from user's current balance
        description: `Payment for contract ${payment.contractId}`,
        status: 'completed'
      }, { transaction: t });

      // Credit to freelancer
      await Transaction.create({
        userId: payment.receiverId,
        paymentId: payment.id,
        type: 'credit',
        amount: payment.freelancerAmount,
        currency: payment.currency,
        balance: 0, // Calculate from user's current balance
        description: `Payment received for contract ${payment.contractId}`,
        status: 'completed'
      }, { transaction: t });

      // Update freelancer profile earnings
      const freelancerProfile = await Profile.findOne({
        where: { userId: payment.receiverId }
      });
      if (freelancerProfile) {
        freelancerProfile.totalEarnings = parseFloat(freelancerProfile.totalEarnings || 0) + parseFloat(payment.freelancerAmount);
        await freelancerProfile.save({ transaction: t });
      }

      await t.commit();

      res.status(200).json({
        success: true,
        data: payment
      });
    } catch (error) {
      await t.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Release payment
// @route   POST /api/payments/:id/release
// @access  Private
exports.releasePayment = async (req, res) => {
  try {
    const payment = await Payment.findByPk(req.params.id, {
      include: [{
        model: Contract,
        as: 'contract'
      }]
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    const contract = payment.contract;
    if (contract.buyerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (payment.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Payment must be completed before release'
      });
    }

    // Update contract payment status
    contract.paymentStatus = 'released';
    await contract.save();

    res.status(200).json({
      success: true,
      message: 'Payment released successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user transactions
// @route   GET /api/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { type, page = 1, limit = 20 } = req.query;
    const where = { userId: req.user.id };
    if (type) where.type = type;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const transactions = await Transaction.findAndCountAll({
      where,
      include: [{
        model: Payment,
        as: 'payment',
        include: [{
          model: Contract,
          as: 'contract'
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: transactions.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: transactions.count,
        pages: Math.ceil(transactions.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Request withdrawal
// @route   POST /api/payments/withdraw
// @access  Private
exports.requestWithdrawal = async (req, res) => {
  try {
    const { amount, currency, paymentMethod, accountDetails } = req.body;
    const minWithdrawal = parseFloat(process.env.MIN_WITHDRAWAL_AMOUNT || 50);

    if (amount < minWithdrawal) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal amount is ${minWithdrawal} ${currency}`
      });
    }

    // Get user balance (sum of credits - debits)
    const balance = await Transaction.sum('amount', {
      where: {
        userId: req.user.id,
        currency,
        status: 'completed',
        type: 'credit'
      }
    }) - (await Transaction.sum('amount', {
      where: {
        userId: req.user.id,
        currency,
        status: 'completed',
        type: 'debit'
      }
    }) || 0);

    if (balance < amount) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    const payment = await Payment.create({
      payerId: req.user.id,
      receiverId: req.user.id, // Self payment for withdrawal
      amount,
      currency,
      paymentMethod,
      paymentType: 'withdrawal',
      status: 'pending',
      metadata: { accountDetails }
    });

    // Create debit transaction
    await Transaction.create({
      userId: req.user.id,
      paymentId: payment.id,
      type: 'debit',
      amount,
      currency,
      balance: balance - amount,
      description: `Withdrawal request`,
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

