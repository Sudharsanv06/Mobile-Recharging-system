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

const sendSMS = async (to, body) => {
  try {
    const message = await client.messages.create({
      body,
      from: twilioPhoneNumber,
      to: `+91${to}` // Assuming Indian numbers
    });
    console.log(`SMS sent: ${message.sid}`);
    return true;
  } catch (err) {
    console.error('Error sending SMS:', err.message);
    return false;
  }
};

module.exports = sendSMS;