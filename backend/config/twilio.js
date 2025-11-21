const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

let client = null;
if (accountSid && authToken) {
  try {
    client = twilio(accountSid, authToken);
  } catch (err) {
    console.warn('Failed to initialize Twilio client in config/twilio.js:', err.message);
    client = null;
  }
} else {
  console.warn('Twilio credentials not found in environment. Twilio client will be unavailable.');
}

module.exports = client;