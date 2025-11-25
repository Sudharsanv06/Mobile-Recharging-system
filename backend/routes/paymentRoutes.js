const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { verifyWebhook, webhookHandler } = require('../controllers/webhookController');
const { protect } = require('../middleware/auth');

// Create a Razorpay order (protected)
router.post('/create-order', protect, createOrder);

// Verify a payment (protected)
router.post('/verify', protect, verifyPayment);

// Webhook (public) with signature verification
router.post('/webhook', verifyWebhook, webhookHandler);

module.exports = router;
