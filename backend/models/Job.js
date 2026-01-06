const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  buyerId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'categories',
      key: 'id'
    }
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  skills: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  budget: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  budgetType: {
    type: DataTypes.ENUM('fixed', 'hourly'),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  durationUnit: {
    type: DataTypes.ENUM('days', 'weeks', 'months'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('posted', 'bidding', 'hired', 'in_progress', 'completed', 'cancelled', 'disputed'),
    defaultValue: 'posted'
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  isRemote: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  attachments: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  hiredFreelancerId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  bidsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  tableName: 'jobs',
  timestamps: true
});

module.exports = Job;

