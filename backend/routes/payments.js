const express = require('express');
const router = express.Router();
const {
  createPayment,
  processPayment,
  releasePayment,
  getTransactions,
  requestWithdrawal
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/', protect, createPayment);
router.post('/:id/process', protect, authorize('admin'), processPayment);
router.post('/:id/release', protect, releasePayment);
router.get('/transactions', protect, getTransactions);
router.post('/withdraw', protect, requestWithdrawal);

module.exports = router;

