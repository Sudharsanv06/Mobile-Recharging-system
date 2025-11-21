const Verification = require('../models/Verification');
const generateOTP = require('../utils/generateOTP');
const sendSMS = require('../utils/sendSMS');

exports.sendOTP = async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber is required',
      });
    }

    // Basic format check (India-style 10 digit)
    if (!/^\d{10}$/.test(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid phoneNumber format',
      });
    }

    // Generate 6-digit OTP
    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // Upsert verification document
    const verification = await Verification.findOneAndUpdate(
      { phoneNumber },
      { otp, isVerified: false, expiresAt },
      { new: true, upsert: true }
    );

    // Send SMS (or mock)
    const sent = await sendSMS(`+91${phoneNumber}`, `Your OTP is ${otp}. It will expire in 10 minutes.`);

    if (!sent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send OTP SMS',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
      data: {
        phoneNumber: `*******${phoneNumber.slice(-3)}`, // mask
        expiresInMinutes: 10,
      },
    });
  } catch (err) {
    console.error('sendOTP error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while sending OTP',
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp) {
      return res.status(400).json({
        success: false,
        message: 'phoneNumber and otp are required',
      });
    }

    const verification = await Verification.findOne({ phoneNumber });

    if (!verification) {
      return res.status(400).json({
        success: false,
        message: 'No OTP request found for this phone number',
      });
    }

    // Check expiration
    if (verification.expiresAt < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'OTP has expired. Please request a new one.',
      });
    }

    // Check OTP match
    if (verification.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: 'Invalid OTP',
      });
    }

    verification.isVerified = true;
    await verification.save();

    return res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      data: {
        phoneNumber: verification.phoneNumber,
        verifiedAt: verification.updatedAt,
      },
    });
  } catch (err) {
    console.error('verifyOTP error:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while verifying OTP',
    });
  }
};