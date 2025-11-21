const User = require('../models/User');
const generateOTP = require('../utils/generateOTP');
const sendSMS = require('../utils/sendSMS');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

// Register user
exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { phone }] });
    if (user) {
      logger.warn('Register attempt for existing user', { email, phone });
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = new User({
      name,
      email,
      phone,
      password,
    });

    // Generate OTP
    const otp = generateOTP();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await user.save();

    // Send OTP via SMS (best-effort)
    const message = `Your OTP for mobile recharge app is ${otp}. It expires in 10 minutes.`;
    const smsSent = await sendSMS(phone, message);

    // Generate token
    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error('JWT sign error during register', { error: err.message });
        return res.status(500).json({ success: false, message: 'Failed to create account token' });
      }
      logger.info('User registered', { userId: user.id, smsSent });
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
      return res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { token, user: userData },
      });
    });
  } catch (err) {
    logger.error('Error in register', { error: err.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { otp } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      logger.warn('Verify OTP: user not found', { userId: req.user && req.user.id });
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      logger.warn('Verify OTP failed', { userId: user.id });
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    logger.info('User phone verified', { userId: user.id });
    return res.json({ success: true, message: 'Phone number verified successfully' });
  } catch (err) {
    logger.error('Error in verifyOTP', { error: err.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { emailOrUsername, password } = req.body;

    // Find user by email or name
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { name: emailOrUsername }
      ]
    });
    if (!user) {
      logger.warn('Login failed: user not found', { emailOrUsername });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      logger.warn('Login failed: invalid password', { userId: user.id });
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        logger.error('JWT sign error during login', { error: err.message });
        return res.status(500).json({ success: false, message: 'Failed to create token' });
      }
      logger.info('User logged in', { userId: user.id });
      const userData = {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      };
      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: { token, user: userData },
      });
    });
  } catch (err) {
    logger.error('Error in login', { error: err.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    res.json({ success: true, data: user });
  } catch (err) {
    logger.error('Error in getProfile', { error: err.message });
    res.status(500).json({ success: false, message: 'Server error' });
  }
};