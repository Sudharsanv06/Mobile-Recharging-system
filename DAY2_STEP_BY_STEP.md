# 🚀 Day 2 - Complete Backend Deployment Guide

**Objective**: Deploy backend to Render with MongoDB Atlas, configure webhooks, and verify everything works.

**Time Required**: 60-75 minutes  
**Difficulty**: Medium

---

## 📋 Before You Start

### Tools Needed
- [ ] Code pushed to GitHub (main branch)
- [ ] Terminal/Command Line access
- [ ] Web browser
- [ ] Postman or Thunder Client (for API testing)

### Accounts Required
1. **GitHub** - Repository hosting (you already have this ✅)
2. **Render** - Backend hosting ([Sign up free](https://dashboard.render.com/register))
3. **MongoDB Atlas** - Database hosting ([Sign up free](https://www.mongodb.com/cloud/atlas/register))
4. **Razorpay** - Payment gateway ([Sign up](https://dashboard.razorpay.com/signup))
5. **Twilio** (Optional) - SMS service ([Sign up](https://www.twilio.com/try-twilio))
6. **Gmail** - Email service (use existing account)

---

## 🎯 Phase 1: Prepare Credentials (20 minutes)

### Step 1.1: Generate JWT Secret

```bash
cd backend
node scripts/generate-jwt-secret.js
```

**Copy the generated 64-character secret and save it somewhere safe!**

Example output:
```
ae30602c476d938679ef51ebd63affeb2ffb26188eedcffb4ff433a05bfdfee3
```

---

### Step 1.2: Setup MongoDB Atlas

#### Create Free Cluster
1. Go to https://cloud.mongodb.com
2. Sign up / Log in
3. Click "Build a Database"
4. Choose **"M0 FREE"** cluster
5. Provider: AWS, Region: Choose closest to your location
6. Cluster Name: Keep default or name it `mobile-recharge-cluster`
7. Click **"Create"** (wait 3-5 minutes)

#### Create Database User
1. Security → **Database Access** → **"Add New Database User"**
2. Authentication: **Password**
3. Username: `mobile-recharge-admin`
4. **Generate a secure password** → **Copy it!** (You'll need this)
5. Database User Privileges: **"Atlas Admin"**
6. Click **"Add User"**

#### Configure Network Access
1. Security → **Network Access** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"** (for testing)
3. IP Address: `0.0.0.0/0` (will be auto-filled)
4. Click **"Confirm"**

⚠️ **Security Note**: For production, restrict to Render's IP addresses later.

#### Get Connection String
1. Deployment → **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Driver: **Node.js**, Version: **5.5 or later**
4. **Copy the connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

5. **Replace**:
   - `<username>` with `mobile-recharge-admin`
   - `<password>` with your generated password
   - Add `/mobile-recharge` before `?`:
   ```
   mongodb+srv://mobile-recharge-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mobile-recharge?retryWrites=true&w=majority
   ```

**Save this complete connection string!**

---

### Step 1.3: Get Razorpay Credentials

1. Go to https://dashboard.razorpay.com
2. Sign up / Log in
3. Settings → **API Keys** → **"Generate Key"**
4. **Copy both**:
   - Key ID: `rzp_test_xxxxxxxxxxxx` (for testing)
   - Key Secret: `xxxxxxxxxxxxxxxxxxxx`

⚠️ **Note**: Use test keys for now. Switch to live keys when going to production.

---

### Step 1.4: Get Twilio Credentials (Optional)

1. Go to https://console.twilio.com
2. Sign up (free trial available)
3. Dashboard shows:
   - **Account SID**: `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Auth Token**: Click to reveal and copy
4. Get a Phone Number:
   - Phone Numbers → **"Buy a number"**
   - Search by country → Buy number
   - **Copy the phone number** (format: `+1234567890`)

---

### Step 1.5: Generate Gmail App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select app: **"Mail"**
3. Select device: **"Other"** → Type: `Mobile Recharge App`
4. Click **"Generate"**
5. **Copy the 16-character password** (like: `abcd efgh ijkl mnop`)

---

## 📝 Phase 2: Prepare Environment Variables (10 minutes)

Create a text file (NOT in your git repo) with all values filled in:

```bash
# Copy this template and fill in YOUR values
# DO NOT commit this file to git!

NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://mobile-recharge-admin:YOUR_MONGO_PASSWORD@cluster0.xxxxx.mongodb.net/mobile-recharge?retryWrites=true&w=majority
JWT_SECRET=YOUR_64_CHARACTER_SECRET_FROM_STEP_1.1
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=YOUR_RAZORPAY_SECRET
RAZORPAY_WEBHOOK_SECRET=will_add_this_later
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=YOUR_TWILIO_AUTH_TOKEN
TWILIO_PHONE_NUMBER=+1234567890
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your 16char app password
EMAIL_FROM=noreply@yourapp.com
ALLOWED_ORIGINS=http://localhost:5173,https://*.vercel.app
SENTRY_DSN=
```

**Save this file as `render-env-vars.txt` in a safe place (NOT in your project folder)**

---

## 🚀 Phase 3: Deploy to Render (25 minutes)

### Step 3.1: Create Web Service

1. Go to https://dashboard.render.com
2. Sign in with GitHub (recommended) or create account
3. Click **"New +"** → **"Web Service"**
4. Click **"Connect account"** if GitHub not connected
5. Find your repository: `Mobile-Recharging-system`
6. Click **"Connect"**

---

### Step 3.2: Configure Service Settings

Fill in the form:

**Name**:
```
mobile-recharge-backend
```

**Region**: Choose closest to your users (e.g., `Oregon (US West)`)

**Branch**: 
```
main
```

**Root Directory**:
```
backend
```

**Runtime**:
```
Node
```

**Build Command**:
```
npm install
```

**Start Command**:
```
npm start
```

---

### Step 3.3: Select Plan

- **Instance Type**: Select **"Free"** ($0/month)
- 512 MB RAM, 0.1 CPU
- ⚠️ Note: Free tier spins down after 15 min of inactivity

---

### Step 3.4: Add Environment Variables

Scroll to **"Environment Variables"** section:

**Method 1: Bulk Add (Recommended)**
1. Click **"Add from .env"**
2. Open your `render-env-vars.txt` file
3. Copy ALL variables
4. Paste into the text area
5. Click **"Add Variables"**

**Method 2: Add One by One**
Click **"Add Environment Variable"** for each:
- Key: `NODE_ENV`, Value: `production`
- Key: `PORT`, Value: `10000`
- Key: `MONGODB_URI`, Value: `your-connection-string`
- (Continue for all variables...)

---

### Step 3.5: Advanced Settings

Scroll to **"Advanced"**:

**Health Check Path**:
```
/health
```

**Auto-Deploy**: ✅ Enabled (default)

---

### Step 3.6: Create Service

1. Review all settings
2. Click **"Create Web Service"**
3. Render starts building immediately

---

### Step 3.7: Monitor Deployment

Watch the **"Logs"** tab (auto-opens):

```
==> Cloning from GitHub...
==> Running build command: npm install
==> Build successful
==> Starting service
==> Your service is live 🎉
```

Look for these success messages:
```
Server running on port 10000
MongoDB connected successfully
Socket.io initialized
```

**Deployment takes 5-10 minutes** ⏳

---

## ✅ Phase 4: Verify Deployment (10 minutes)

### Step 4.1: Get Your Service URL

At the top of Render dashboard:
```
https://mobile-recharge-backend.onrender.com
```

**Copy this URL!** You'll need it throughout.

---

### Step 4.2: Test Health Endpoint

**In Browser:**
Open: `https://mobile-recharge-backend.onrender.com/health`

**Or in Terminal:**
```bash
curl https://mobile-recharge-backend.onrender.com/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "ok",
  "version": "1.0.0",
  "uptime": 45.123,
  "timestamp": "2025-12-04T12:00:00.000Z",
  "env": "production"
}
```

✅ If you see this, backend is LIVE!

---

### Step 4.3: Test API Endpoints

**A. Test Operators Endpoint**

Browser: `https://mobile-recharge-backend.onrender.com/api/v1/operators`

Should return list of operators or empty array.

---

**B. Test User Registration (Postman/Thunder Client)**

**POST** `https://mobile-recharge-backend.onrender.com/api/v1/auth/register`

Headers:
```
Content-Type: application/json
```

Body (JSON):
```json
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123!@#",
  "phone": "+1234567890"
}
```

**Expected Response** (201 Created):
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

---

**C. Test Login**

**POST** `https://mobile-recharge-backend.onrender.com/api/v1/auth/login`

Body:
```json
{
  "emailOrUsername": "test@example.com",
  "password": "Test123!@#"
}
```

Should return token.

---

### Step 4.4: Verify MongoDB Connection

1. Go to MongoDB Atlas dashboard
2. Click **"Database"** → **"Browse Collections"**
3. You should see:
   - Database: `mobile-recharge`
   - Collection: `users` (with 1 document from registration)

✅ Database working!

---

### Step 4.5: Check Logs

Render Dashboard → Your Service → **Logs**

Look for:
- ✅ No error messages
- ✅ "Server running on port 10000"
- ✅ "MongoDB connected"
- ✅ API requests showing up

---

## 🔗 Phase 5: Configure Razorpay Webhook (15 minutes)

### Step 5.1: Create Webhook in Razorpay

1. Go to https://dashboard.razorpay.com
2. Settings → **Webhooks** → **"Create New Webhook"**

**Webhook Setup URL**:
```
https://mobile-recharge-backend.onrender.com/api/v1/payments/webhook
```

**Secret**: Click **"Generate"** → **Copy the secret!**

**Active Events** - Select:
- ✅ `payment.authorized`
- ✅ `payment.captured`
- ✅ `payment.failed`

Click **"Create Webhook"**

---

### Step 5.2: Add Webhook Secret to Render

1. Render Dashboard → Your Service → **"Environment"** tab
2. Find `RAZORPAY_WEBHOOK_SECRET` variable
3. Click **"Edit"**
4. Paste the webhook secret from Razorpay
5. Click **"Save"**

⚠️ Service will automatically redeploy (wait 2-3 minutes)

---

### Step 5.3: Test Webhook

**In Razorpay Dashboard:**
1. Settings → Webhooks → Your webhook → **"Test Webhook"**
2. Select Event: `payment.captured`
3. Click **"Send Test Webhook"**

**Expected Response:**
- Status: **200 OK**
- Response: `{"success": true}`

**Check Render Logs:**
```
Webhook received: payment.captured
HMAC signature verified successfully
Processing webhook event...
```

✅ Webhook working!

---

## 🎯 Phase 6: Final Verification (5 minutes)

### Complete Checklist

- [ ] Health endpoint returns 200 OK
- [ ] MongoDB database created with collections
- [ ] User registration works
- [ ] User login returns JWT token
- [ ] Protected endpoints require authentication
- [ ] Razorpay webhook responds with 200
- [ ] No errors in Render logs
- [ ] Service URL is accessible from anywhere

---

## 📊 Deployment Summary

Save these for your records:

**Backend URL:**
```
https://mobile-recharge-backend.onrender.com
```

**Important Endpoints:**
- Health: `GET /health`
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Operators: `GET /api/v1/operators`
- Webhook: `POST /api/v1/payments/webhook`

**Services Configured:**
- ✅ Render Web Service
- ✅ MongoDB Atlas (M0 Free)
- ✅ Razorpay Webhook
- ✅ Twilio SMS (if configured)
- ✅ Gmail SMTP

---

## 🐛 Troubleshooting Guide

### Issue: Build Failed

**Symptoms**: Red error in build logs

**Solutions**:
1. Check `package.json` is in `backend` folder
2. Verify Root Directory is set to `backend`
3. Check for missing dependencies
4. Look at specific error in logs

---

### Issue: MongoDB Connection Timeout

**Symptoms**: "MongoDB connection failed" in logs

**Solutions**:
1. Verify connection string format
2. Check username/password are correct
3. Confirm database name `/mobile-recharge` is included
4. Verify IP whitelist includes `0.0.0.0/0`
5. Test connection string locally first

---

### Issue: Health Check Failing

**Symptoms**: Service shows "Unhealthy"

**Solutions**:
1. Verify Health Check Path is `/health` not `/api/v1/health`
2. Wait 3-5 minutes after deployment
3. Check logs for startup errors
4. Test endpoint manually in browser

---

### Issue: 502 Bad Gateway

**Symptoms**: Website shows 502 error

**Solutions**:
1. Check if service is still deploying (wait)
2. Verify PORT is not hardcoded
3. Check logs for crash/restart
4. Ensure server listens on `0.0.0.0` not `localhost`

---

### Issue: Webhook 401 Unauthorized

**Symptoms**: Razorpay test webhook fails

**Solutions**:
1. Verify `RAZORPAY_WEBHOOK_SECRET` matches dashboard
2. Wait for service to redeploy after adding secret
3. Check raw body middleware is before express.json()
4. Review webhook signature verification in logs

---

## 💰 Cost Summary

**Current Setup (Free Tier):**
- Render Web Service: **$0/month** (750 hrs free)
- MongoDB Atlas M0: **$0/month** (512 MB)
- Razorpay: **$0** (pay per transaction)
- Twilio: **Pay per SMS** (~$0.0079/SMS)
- Gmail: **$0** (using personal account)

**Total Monthly Cost: $0** (except SMS usage)

---

## 🎉 Success! Day 2 Complete

### What You've Accomplished:

✅ Backend deployed to Render
✅ MongoDB Atlas configured and connected
✅ Environment variables securely set
✅ Health monitoring active
✅ Razorpay webhooks configured
✅ All API endpoints working
✅ Database operations verified

### Next Steps (Day 3):

- Deploy frontend to Vercel
- Connect frontend to this backend
- Test complete payment flow
- Configure domain (optional)

---

**Time Spent**: ________ minutes  
**Completion Date**: ________  
**Backend URL**: ________________________________

**Status**: ✅ READY FOR DAY 3

---

*Need help? Check logs in Render dashboard or review troubleshooting section above.*
