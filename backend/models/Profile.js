const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  timezone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  hourlyRate: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING,
    defaultValue: 'USD'
  },
  profileCompletion: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  jobSuccessScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  totalEarnings: {
    type: DataTypes.DECIMAL(12, 2),
    defaultValue: 0
  },
  totalJobs: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalHours: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    defaultValue: 0
  },
  totalReviews: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  badges: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  portfolio: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  languages: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  availability: {
    type: DataTypes.ENUM('available', 'busy', 'unavailable'),
    defaultValue: 'available'
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  companyWebsite: {
    type: DataTypes.STRING,
    allowNull: true
  },
  taxId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  kycDocuments: {
    type: DataTypes.JSON,
    defaultValue: []
  }
}, {
  tableName: 'profiles',
  timestamps: true
});

module.exports = Profile;

