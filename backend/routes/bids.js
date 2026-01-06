const express = require('express');
const router = express.Router();
const {
  getJobBids,
  createBid,
  acceptBid,
  getMyBids
} = require('../controllers/bidController');
const { protect, authorize } = require('../middleware/auth');

router.get('/my-bids', protect, authorize('freelancer', 'admin'), getMyBids);
router.get('/jobs/:jobId', protect, getJobBids);
router.post('/jobs/:jobId', protect, authorize('freelancer', 'admin'), createBid);
router.put('/:id/accept', protect, authorize('buyer', 'admin'), acceptBid);

module.exports = router;

