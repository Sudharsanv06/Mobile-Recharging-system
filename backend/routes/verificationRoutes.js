const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

router.post('/send-otp', verificationController.sendOTP);
router.post('/verify-otp', verificationController.verifyOTP);

module.exports = router;