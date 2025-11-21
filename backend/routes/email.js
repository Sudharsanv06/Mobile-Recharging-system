// backend/routes/email.js
const express = require('express');
const router = express.Router();
const { sendRechargeConfirmationEmail } = require('../config/nodemailer');

router.post('/send-confirmation', async (req, res) => {
  const { email, rechargeDetails } = req.body;

  try {
    await sendRechargeConfirmationEmail(email, rechargeDetails);
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

module.exports = router;
