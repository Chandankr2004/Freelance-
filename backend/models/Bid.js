const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Bid = sequelize.define('Bid', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  jobId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  freelancerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  deliveryTime: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  deliveryUnit: {
    type: DataTypes.ENUM('days', 'weeks', 'months'),
    defaultValue: 'days'
  },
  proposal: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'accepted', 'rejected', 'withdrawn'),
    defaultValue: 'pending'
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'bids',
  timestamps: true
});

module.exports = Bid;

