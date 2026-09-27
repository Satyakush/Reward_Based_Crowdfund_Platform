const router = require('express').Router();
const express = require('express');
const { handleRazorpayWebhook } = require('../controllers/paymentWebhookController');

router.post('/razorpay', express.raw({ type: 'application/json' }), handleRazorpayWebhook);
module.exports = router;
