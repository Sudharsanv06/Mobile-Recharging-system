const mongoose = require('mongoose');
const dotenv = require('dotenv');
const logger = require('../utils/logger');
dotenv.config();
const connectDB = async () => {
  try {
    // Support either MONGODB_URI or MONGO_URI env var (some setups use MONGO_URI)
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/';
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('MongoDB Connected');
  } catch (err) {
    logger.error('Database connection error', { error: err.message });
    process.exit(1);
  }
};

module.exports = connectDB;
