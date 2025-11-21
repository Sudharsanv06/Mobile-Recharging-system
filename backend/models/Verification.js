const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 }, // TTL index – Mongo will delete expired docs
  },
}, { timestamps: true });

// Export model
module.exports = mongoose.model('Verification', verificationSchema);