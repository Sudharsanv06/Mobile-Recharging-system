// backend/utils/sendSMS.js
const client = require('../config/twilio');

async function sendSMS(to, body) {
  // 🔹 Dev mode: mock SMS (no real Twilio call)
  if (process.env.MOCK_SMS === 'true') {
    console.log(`[MOCK SMS] To: ${to} | Message: ${body}`);
    return true;
  }

  try {
    const message = await client.messages.create({
      to,
      from: process.env.TWILIO_PHONE_NUMBER,
      body,
    });

    console.log('SMS sent:', message.sid);
    return true;
  } catch (err) {
    console.error('Error sending SMS:', err.message);
    return false;
  }
}

module.exports = sendSMS;