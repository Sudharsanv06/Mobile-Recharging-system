const fs = require('fs');
const path = require('path');

const envContent = `# Database Configuration
MONGODB_URI=mongodb://localhost:27017/mobile-recharge-app

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here_change_in_production

# Twilio Configuration
# Replace these with your actual Twilio credentials
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Server Configuration
PORT=5000
NODE_ENV=development
`;

const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Please update the Twilio credentials in the .env file with your actual values.');
    console.log('🔗 Get your Twilio credentials from: https://console.twilio.com/');
  } else {
    console.log('⚠️  .env file already exists. Skipping creation.');
  }
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
} 