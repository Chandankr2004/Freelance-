const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage
} = require('../controllers/messageController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/conversations', protect, getConversations);
router.get('/:userId', protect, getMessages);
router.post('/', protect, upload.array('attachments', 5), sendMessage);

module.exports = router;

