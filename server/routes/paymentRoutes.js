const router = require('express').Router();
const { protect } = require('../middleware/authMiddleware');
const { createPaymentOrder, verifyPayment } = require('../controllers/paymentController');

router.post('/campaigns/:campaignId/order', protect, createPaymentOrder);
router.post('/campaigns/:campaignId/verify', protect, verifyPayment);

module.exports = router;
