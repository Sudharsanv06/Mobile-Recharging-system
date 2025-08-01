const express = require('express');
const {
  register,
  verifyOTP,
  login,
  getProfile,
  sendOTP
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/register', register);
router.post('/verify-otp', protect, verifyOTP);
router.post('/login', login);
router.get('/profile', protect, getProfile);
// router.post('/send-otp', protect, sendOTP);

module.exports = router;