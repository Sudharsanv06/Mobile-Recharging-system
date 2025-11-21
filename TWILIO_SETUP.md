# Twilio SMS Integration Setup Guide

This guide will help you set up Twilio SMS functionality for mobile number verification and recharge confirmations.

## Prerequisites

1. A Twilio account (sign up at [twilio.com](https://www.twilio.com))
2. A verified phone number in your Twilio account
3. Your Twilio Account SID and Auth Token

## Step 1: Get Your Twilio Credentials

1. **Sign up for Twilio**: Go to [twilio.com](https://www.twilio.com) and create a free account
2. **Get your credentials**: 
   - Log into your Twilio Console
   - Find your **Account SID** and **Auth Token** on the dashboard
   - Note these down - you'll need them for the environment variables

## Step 2: Get a Twilio Phone Number

1. **Purchase a phone number**:
   - In your Twilio Console, go to Phone Numbers → Manage → Buy a number
   - Choose a number that supports SMS capabilities
   - For India, you might need to verify your account first

2. **Note the phone number**: Copy the full phone number (including country code)

## Step 3: Configure Environment Variables

1. **Open the `.env` file** in the `backend` folder
2. **Update the Twilio credentials**:

```env
# Twilio Configuration
TWILIO_ACCOUNT_SID=your_actual_account_sid_here
TWILIO_AUTH_TOKEN=your_actual_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here
```

Replace the placeholder values with your actual Twilio credentials.

## Step 4: Test the Integration

1. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend server**:
   ```bash
   cd client
   npm run dev
   ```

3. **Test mobile verification**:
   - Go to any operator page (Jio, Airtel, Vi, BSNL)
   - Enter a mobile number
   - Proceed to payment
   - Click "Verify Now" in the mobile verification section
   - Enter your mobile number and request an OTP
   - Check your phone for the SMS

4. **Test recharge confirmation**:
   - Complete a recharge
   - Check both the user's phone and the recharged number for confirmation SMS

## Features Implemented

### ✅ Mobile Number Verification
- **OTP Generation**: 6-digit OTP with 10-minute expiry
- **SMS Sending**: Automatic OTP delivery via Twilio
- **Verification UI**: Modern modal interface for OTP entry
- **Security**: OTP validation and expiration handling

### ✅ Recharge Confirmation SMS
- **User Notification**: SMS sent to the user's registered phone
- **Recharge Notification**: SMS sent to the recharged mobile number
- **Transaction Details**: Includes amount, plan details, and transaction ID

### ✅ Security Features
- **Phone Number Validation**: Indian mobile number format validation
- **OTP Expiration**: Automatic cleanup of expired OTPs
- **Rate Limiting**: Built-in protection against spam
- **Error Handling**: Comprehensive error messages

## API Endpoints

### Mobile Verification
- `POST /api/v1/verification/send-otp` - Send OTP
- `POST /api/v1/verification/verify-otp` - Verify OTP
- `GET /api/v1/verification/check/:phoneNumber` - Check verification status

### Recharge (Updated)
- `POST /api/v1/recharges` - Create recharge with SMS confirmation

## Troubleshooting

### Common Issues

1. **"Twilio credentials are missing"**
   - Check your `.env` file has all required Twilio variables
   - Ensure no extra spaces in the values

2. **"Failed to send OTP"**
   - Verify your Twilio phone number is SMS-enabled
   - Check your Twilio account has sufficient credits
   - Ensure the phone number format is correct (+91XXXXXXXXXX)

3. **"Invalid phone number"**
   - Make sure you're using a valid Indian mobile number (10 digits)
   - Number should start with 6, 7, 8, or 9

4. **SMS not received**
   - Check your phone's signal and SMS inbox
   - Verify the Twilio number is not blocked
   - Check Twilio logs for delivery status

### Twilio Console Tips

1. **Monitor SMS**: Check the Twilio Console → Phone Numbers → Manage → Active numbers
2. **View Logs**: Go to Twilio Console → Monitor → Logs to see SMS delivery status
3. **Check Credits**: Monitor your account balance in the Twilio Console

## Cost Considerations

- **Free Trial**: Twilio offers a free trial with $15-20 credit
- **SMS Pricing**: ~$0.0075 per SMS (varies by country)
- **Phone Numbers**: ~$1/month per number
- **Production**: Consider upgrading to a paid plan for production use

## Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **Phone Validation**: Always validate phone numbers on both frontend and backend
3. **Rate Limiting**: Implement rate limiting for OTP requests
4. **Logging**: Monitor SMS delivery and failed attempts
5. **Backup**: Consider having backup SMS providers for production

## Next Steps

1. **Production Deployment**: Update environment variables for production
2. **Monitoring**: Set up SMS delivery monitoring
3. **Analytics**: Track verification success rates
4. **Internationalization**: Support other countries if needed
5. **Voice OTP**: Add voice call OTP as backup option

---

**Note**: This implementation uses Twilio's SMS service. For production use, ensure compliance with local SMS regulations and consider implementing additional security measures. 