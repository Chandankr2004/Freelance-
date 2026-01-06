const { Profile, User, Skill, Review, Contract } = require('../models');
const { Op } = require('sequelize');

// @desc    Get or create profile
// @route   GET /api/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({
      where: { userId: req.user.id },
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: [] }
      }]
    });

    if (!profile) {
      profile = await Profile.create({
        userId: req.user.id,
        displayName: req.user.email.split('@')[0]
      });
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update profile
// @route   PUT /api/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne({ where: { userId: req.user.id } });

    // Prepare update data
    const updateData = {};

    // Handle text fields from FormData
    if (req.body.firstName !== undefined) updateData.firstName = req.body.firstName;
    if (req.body.lastName !== undefined) updateData.lastName = req.body.lastName;
    if (req.body.displayName !== undefined) updateData.displayName = req.body.displayName;
    if (req.body.bio !== undefined) updateData.bio = req.body.bio;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.hourlyRate !== undefined) {
      updateData.hourlyRate = req.body.hourlyRate ? parseFloat(req.body.hourlyRate) : null;
    }
    if (req.body.currency !== undefined) updateData.currency = req.body.currency;
    if (req.body.timezone !== undefined) updateData.timezone = req.body.timezone;

    // Handle avatar upload
    if (req.files && req.files.avatar && req.files.avatar[0]) {
      const avatarFile = req.files.avatar[0];
      // Save relative path from uploads directory
      updateData.avatar = `/uploads/avatars/${avatarFile.filename}`;
    }

    if (!profile) {
      profile = await Profile.create({
        userId: req.user.id,
        ...updateData
      });
    } else {
      await profile.update(updateData);
    }

    // Calculate profile completion
    const completion = calculateProfileCompletion(profile);
    profile.profileCompletion = completion;
    await profile.save();

    const updatedProfile = await Profile.findByPk(profile.id, {
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    console.error('Profile update error:', error);
    let errorMessage = 'Failed to update profile';
    
    if (error.name === 'SequelizeValidationError') {
      errorMessage = error.errors.map(e => e.message).join(', ');
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

// @desc    Get public profile
// @route   GET /api/profile/:userId
// @access  Public
exports.getPublicProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne({
      where: { userId: req.params.userId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'email', 'role', 'isEmailVerified', 'isPhoneVerified', 'isKYCVerified']
        },
        {
          model: Skill,
          as: 'skills',
          through: { attributes: [] }
        }
      ]
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Get reviews
    const reviews = await Review.findAll({
      where: { revieweeId: req.params.userId },
      include: [{
        model: User,
        as: 'reviewer',
        attributes: ['id', 'email'],
        include: [{
          model: Profile,
          as: 'profile',
          attributes: ['displayName', 'avatar']
        }]
      }],
      order: [['createdAt', 'DESC']],
      limit: 10
    });

    // Get job stats
    const completedContracts = await Contract.count({
      where: {
        freelancerId: req.params.userId,
        status: 'completed'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        profile,
        reviews,
        stats: {
          completedJobs: completedContracts,
          totalEarnings: profile.totalEarnings,
          rating: profile.rating,
          totalReviews: profile.totalReviews
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update profile skills
// @route   PUT /api/profile/skills
// @access  Private
exports.updateSkills = async (req, res) => {
  try {
    const { skillIds } = req.body;
    const profile = await Profile.findOne({ where: { userId: req.user.id } });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    const skills = await Skill.findAll({
      where: { id: { [Op.in]: skillIds } }
    });

    await profile.setSkills(skills);

    const updatedProfile = await Profile.findByPk(profile.id, {
      include: [{
        model: Skill,
        as: 'skills',
        through: { attributes: [] }
      }]
    });

    res.status(200).json({
      success: true,
      data: updatedProfile
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to calculate profile completion
function calculateProfileCompletion(profile) {
  let completion = 0;
  const fields = [
    'firstName', 'lastName', 'displayName', 'bio', 'location',
    'avatar', 'hourlyRate', 'portfolio', 'languages'
  ];

  fields.forEach(field => {
    if (profile[field] && (Array.isArray(profile[field]) ? profile[field].length > 0 : true)) {
      completion += 100 / fields.length;
    }
  });

  return Math.round(completion);
}

