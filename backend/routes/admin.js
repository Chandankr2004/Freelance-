const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getUsers,
  updateUserStatus,
  verifyKYC,
  getSupportTickets,
  updateSupportTicket,
  getCategories,
  createCategory
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All admin routes require admin role
router.use(protect, authorize('admin'));

router.get('/dashboard', getDashboardStats);
router.get('/users', getUsers);
router.put('/users/:id/status', updateUserStatus);
router.put('/users/:id/verify-kyc', verifyKYC);
router.get('/support-tickets', getSupportTickets);
router.put('/support-tickets/:id', updateSupportTicket);
router.get('/categories', getCategories);
router.post('/categories', createCategory);

module.exports = router;

