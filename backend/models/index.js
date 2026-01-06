const { sequelize } = require('../config/database');
const User = require('./User');
const Profile = require('./Profile');
const Job = require('./Job');
const Bid = require('./Bid');
const Contract = require('./Contract');
const Milestone = require('./Milestone');
const Payment = require('./Payment');
const Transaction = require('./Transaction');
const Message = require('./Message');
const Review = require('./Review');
const Notification = require('./Notification');
const SupportTicket = require('./SupportTicket');
const Skill = require('./Skill');
const Category = require('./Category');

// Define associations
User.hasOne(Profile, { foreignKey: 'userId', as: 'profile' });
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Job, { foreignKey: 'buyerId', as: 'postedJobs' });
Job.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });

User.hasMany(Bid, { foreignKey: 'freelancerId', as: 'bids' });
Bid.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });
Bid.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Job.hasMany(Bid, { foreignKey: 'jobId', as: 'bids' });

Contract.belongsTo(User, { foreignKey: 'buyerId', as: 'buyer' });
Contract.belongsTo(User, { foreignKey: 'freelancerId', as: 'freelancer' });
Contract.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });
Contract.hasMany(Milestone, { foreignKey: 'contractId', as: 'milestones' });
Milestone.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

Payment.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });
Payment.belongsTo(User, { foreignKey: 'payerId', as: 'payer' });
Payment.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });

Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Transaction.belongsTo(Payment, { foreignKey: 'paymentId', as: 'payment' });
Payment.hasMany(Transaction, { foreignKey: 'paymentId', as: 'transactions' });

Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
Message.belongsTo(User, { foreignKey: 'receiverId', as: 'receiver' });
Message.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

Review.belongsTo(User, { foreignKey: 'reviewerId', as: 'reviewer' });
Review.belongsTo(User, { foreignKey: 'revieweeId', as: 'reviewee' });
Review.belongsTo(Contract, { foreignKey: 'contractId', as: 'contract' });

Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

SupportTicket.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Job, { foreignKey: 'categoryId', as: 'jobs' });

Profile.belongsToMany(Skill, { through: 'ProfileSkills', foreignKey: 'profileId', as: 'skills' });
Skill.belongsToMany(Profile, { through: 'ProfileSkills', foreignKey: 'skillId', as: 'profiles' });

module.exports = {
  sequelize,
  User,
  Profile,
  Job,
  Bid,
  Contract,
  Milestone,
  Payment,
  Transaction,
  Message,
  Review,
  Notification,
  SupportTicket,
  Skill,
  Category
};

