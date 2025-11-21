const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/errorHandler');

// Load env vars
dotenv.config();

const app = express();

// OTP rate limiter: 5 requests per 10 minutes per IP
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many OTP requests, please try again later.',
  },
});

// Route files
const authRoutes = require('./routes/authRoutes');
const operatorRoutes = require('./routes/operatorRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const userRoutes = require('./routes/userRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const emailRoutes = require('./routes/email');

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/operators', operatorRoutes);
app.use('/api/v1/recharges', rechargeRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/verification', otpLimiter, verificationRoutes);
app.use('/api/email', emailRoutes);

app.use(errorHandler);

module.exports = app;