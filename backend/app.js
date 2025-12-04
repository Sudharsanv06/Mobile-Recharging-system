const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const errorHandler = require('./middleware/errorHandler');
const requestId = require('./middleware/requestId');
const logger = require('./utils/logger');
const { trackMetrics } = require('./routes/metricsRoutes');
const { Sentry } = require('./config/sentry');

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

// Auth and recharge rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
});

const rechargeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many recharge attempts, slow down.' },
});

// Route files
const authRoutes = require('./routes/authRoutes');
const operatorRoutes = require('./routes/operatorRoutes');
const rechargeRoutes = require('./routes/rechargeRoutes');
const userRoutes = require('./routes/userRoutes');
const verificationRoutes = require('./routes/verificationRoutes');
const emailRoutes = require('./routes/email');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const searchRoutes = require('./routes/searchRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');

// Import webhook handlers for special raw body handling
const { verifyWebhook, webhookHandler } = require('./controllers/webhookController');

// Webhook endpoint with raw body (MUST be before express.json middleware)
// This endpoint needs the raw request body for HMAC signature verification
app.post('/api/v1/payments/webhook', express.raw({ type: 'application/json' }), (req, res, next) => {
  req.rawBody = req.body.toString('utf8');
  req.body = JSON.parse(req.rawBody);
  next();
}, verifyWebhook, webhookHandler);

// Body parser with raw body capture for other routes
app.use(
  express.json({
    verify: (req, _res, buf) => {
      // store raw body string for HMAC verification if needed
      if (buf && buf.length) req.rawBody = buf.toString();
    },
  })
);

// Request ID middleware (adds X-Request-Id)
app.use(requestId);

// Track metrics
app.use(trackMetrics);

// Sentry request handler (must be before other middleware)
if (Sentry) {
  app.use(Sentry.Handlers.requestHandler());
}

// Helmet for secure headers
app.use(helmet());

// CORS policy: restrict in production, open in development
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim()) : [];
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all requests in development
      if (process.env.NODE_ENV === 'development') return callback(null, true);
      
      // Reject requests with no origin (like curl)
      if (!origin) return callback(null, false);
      
      // Check if no origins configured
      if (allowedOrigins.length === 0) {
        logger.warn('No ALLOWED_ORIGINS configured in production');
        return callback(new Error('No allowed origins configured'));
      }
      
      // Check exact match or wildcard pattern match
      const isAllowed = allowedOrigins.some(allowed => {
        // Exact match
        if (allowed === origin) return true;
        // Wildcard match (e.g., https://*.vercel.app)
        if (allowed.includes('*')) {
          const pattern = allowed.replace(/\*/g, '.*').replace(/\./g, '\\.');
          return new RegExp(`^${pattern}$`).test(origin);
        }
        return false;
      });
      
      if (isAllowed) {
        callback(null, true);
      } else {
        logger.warn('CORS rejected origin', { origin, allowedOrigins });
        callback(new Error('Origin not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies/auth headers
  })
);

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint (no auth required)
app.get('/health', (_req, res) => {
  const packageJson = require('./package.json');
  res.json({
    success: true,
    status: 'ok',
    version: packageJson.version,
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

// Mount routers with rate limiting where appropriate
app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/operators', operatorRoutes);
app.use('/api/v1/recharges', rechargeLimiter, rechargeRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/verification', otpLimiter, verificationRoutes);
app.use('/api/email', emailRoutes);
app.use('/api/v1/admin', adminRoutes);
// Payment routes (webhook is handled separately above with raw body)
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/notifications', notificationRoutes);
app.use('/api/v1/plans', searchRoutes);
app.use('/api/v1/favorites', favoriteRoutes);

// Metrics endpoint
const { router: metricsRouter } = require('./routes/metricsRoutes');
app.use('/api/v1', metricsRouter);

// Sentry error handler (must be before errorHandler)
if (Sentry) {
  app.use(Sentry.Handlers.errorHandler());
}

app.use(errorHandler);

module.exports = app;