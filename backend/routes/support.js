const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTicket
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/', protect, upload.array('attachments', 5), createTicket);
router.get('/my-tickets', protect, getMyTickets);
router.get('/:id', protect, getTicket);

module.exports = router;

