const express = require('express');
const router = express.Router();
const {
  getContracts,
  getContract,
  createMilestones,
  updateMilestone,
  completeContract
} = require('../controllers/contractController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getContracts);
router.get('/:id', protect, getContract);
router.post('/:id/milestones', protect, createMilestones);
router.put('/milestones/:id', protect, updateMilestone);
router.put('/:id/complete', protect, completeContract);

module.exports = router;

