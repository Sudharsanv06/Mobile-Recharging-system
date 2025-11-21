# Mobile Recharge App Setup Instructions

## Quick Fix for OTP and Payment Issues

### 1. Fix OTP Sending Issue

The OTP sending is failing because Twilio credentials are not configured. Follow these steps:

#### Step 1: Create Environment File
Run the setup script to create the `.env` file:

```bash
cd backend
node setup-env.js
```

#### Step 2: Configure Twilio (Required for OTP)
1. Sign up for a free Twilio account at [twilio.com](https://www.twilio.com)
2. Get your credentials from the Twilio Console:
   - Account SID
   - Auth Token
   - Phone Number (purchase one that supports SMS)
3. Update the `backend/.env` file with your actual Twilio credentials:

```env
TWILIO_ACCOUNT_SID=your_actual_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

#### Step 3: Start the Servers
```bash
# Terminal 1 - Backend
cd backend
npm install
npm start

# Terminal 2 - Frontend
cd client
npm install
npm run dev
```

### 2. Payment Page Alignment Fixes

The payment page alignment issues have been fixed with the following improvements:

- ✅ Better grid alignment for payment methods
- ✅ Consistent card heights in payment grids
- ✅ Improved responsive design for mobile devices
- ✅ Better spacing and alignment for UPI and bank options
- ✅ Enhanced mobile verification modal styling

### 3. Testing the Fixes

1. **Test OTP Functionality**:
   - Go to any operator page (Jio, Airtel, Vi, BSNL)
   - Enter a mobile number and proceed to payment
   - Click "Verify Now" in the mobile verification section
   - Enter your mobile number and request an OTP
   - You should receive an SMS with the OTP

2. **Test Payment Page**:
   - Navigate to the payment page
   - Check that all payment method cards are properly aligned
   - Test responsive design on different screen sizes
   - Verify that UPI and bank selection grids are properly aligned

### 4. Troubleshooting

#### If OTP still fails:
1. Check that your Twilio account has sufficient credits
2. Verify the phone number format (+91XXXXXXXXXX)
3. Check Twilio Console logs for delivery status
4. Ensure the backend server is running on port 5000

#### If payment page still has alignment issues:
1. Clear browser cache and refresh
2. Check browser console for any CSS errors
3. Test on different browsers

### 5. Development Notes

- The app uses MongoDB for data storage
- JWT is used for authentication
- Twilio SMS service for OTP delivery
- React with Vite for frontend
- Express.js for backend API

### 6. Environment Variables Reference

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mobile-recharge-app

# JWT
JWT_SECRET=your_jwt_secret_key_here

# Twilio (Required for OTP)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Server
PORT=5000
NODE_ENV=development
```

---

**Note**: For production deployment, ensure all environment variables are properly configured and use strong, unique values for JWT_SECRET. 