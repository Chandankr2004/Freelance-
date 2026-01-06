const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));
router.use('/jobs', require('./jobs'));
router.use('/bids', require('./bids'));
router.use('/contracts', require('./contracts'));
router.use('/profile', require('./profile'));
router.use('/payments', require('./payments'));
router.use('/reviews', require('./reviews'));
router.use('/messages', require('./messages'));
router.use('/admin', require('./admin'));
router.use('/support', require('./support'));

module.exports = router;

