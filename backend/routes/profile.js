const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  getPublicProfile,
  updateSkills
} = require('../controllers/profileController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', protect, getProfile);
router.put('/', protect, upload.fields([{ name: 'avatar', maxCount: 1 }]), updateProfile);
router.get('/:userId', getPublicProfile);
router.put('/skills', protect, updateSkills);

module.exports = router;

