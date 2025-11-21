const app = require('./app');
const http = require('http');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const logger = require('./utils/logger');

// Load env vars
dotenv.config();

// Validate critical env vars and warn if missing
const requiredEnvs = ['JWT_SECRET', 'MONGODB_URI'];
const missing = requiredEnvs.filter((k) => !process.env[k]);
if (missing.length) {
  logger.warn('Missing critical environment variables', { missing });
}

if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE_NUMBER) {
  logger.warn('Twilio credentials not fully configured; SMS will be skipped in this environment');
}

const PORT = process.env.PORT || 5000;

connectDB();

const server = http.createServer(app);

// Bind to 0.0.0.0 explicitly to prefer IPv4 and avoid potential ::1/127.0.0.1 binding issues
server.listen(PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${PORT}`);
});