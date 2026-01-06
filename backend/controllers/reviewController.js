const { Review, Contract, User, Profile } = require('../models');

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
exports.createReview = async (req, res) => {
  try {
    const { contractId, rating, comment, categories } = req.body;

    const contract = await Contract.findByPk(contractId);
    if (!contract) {
      return res.status(404).json({
        success: false,
        message: 'Contract not found'
      });
    }

    if (contract.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: 'Contract must be completed before reviewing'
      });
    }

    // Determine reviewee (opposite party)
    const revieweeId = contract.buyerId === req.user.id 
      ? contract.freelancerId 
      : contract.buyerId;

    // Check if already reviewed
    const existingReview = await Review.findOne({
      where: {
        contractId,
        reviewerId: req.user.id
      }
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this contract'
      });
    }

    const review = await Review.create({
      contractId,
      reviewerId: req.user.id,
      revieweeId,
      rating,
      comment,
      categories: categories || {}
    });

    // Update reviewee's rating
    await updateUserRating(revieweeId);

    const reviewWithDetails = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'reviewer',
          include: [{
            model: Profile,
            as: 'profile',
            attributes: ['displayName', 'avatar']
          }]
        },
        {
          model: Contract,
          as: 'contract'
        }
      ]
    });

    res.status(201).json({
      success: true,
      data: reviewWithDetails
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for user
// @route   GET /api/reviews/user/:userId
// @access  Public
exports.getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.findAndCountAll({
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
      limit: parseInt(limit),
      offset
    });

    res.status(200).json({
      success: true,
      data: reviews.rows,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: reviews.count,
        pages: Math.ceil(reviews.count / parseInt(limit))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to update user rating
async function updateUserRating(userId) {
  const reviews = await Review.findAll({
    where: { revieweeId: userId }
  });

  if (reviews.length > 0) {
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    const profile = await Profile.findOne({ where: { userId } });
    if (profile) {
      profile.rating = parseFloat(avgRating.toFixed(2));
      profile.totalReviews = reviews.length;
      await profile.save();
    }
  }
}

