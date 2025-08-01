const twilio = require('twilio');
const dotenv = require('dotenv');
dotenv.config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Add validation
if (!accountSid || !authToken || !twilioPhoneNumber) {
  throw new Error("Twilio credentials are missing in .env file");
}

const client = twilio(accountSid, authToken);

module.exports = client;