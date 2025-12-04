const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

// Create a Razorpay order (protected)
router.post('/create-order', protect, createOrder);

// Verify a payment (protected)
router.post('/verify', protect, verifyPayment);

// Note: Webhook route is handled in app.js with raw body middleware
// This is required for proper Razorpay HMAC signature verification

module.exports = router;
