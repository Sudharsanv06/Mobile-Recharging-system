const rateLimit = require('express-rate-limit');
const logger = require('../utils/logger');

// Generic limiter for OTP endpoints: 5 requests per hour per IP
const otpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', { path: req.originalUrl, ip: req.ip });
    res.status(429).json({
      success: false,
      message: 'Too many requests. Please try again later.'
    });
  }
});

module.exports = {
  otpLimiter,
};
