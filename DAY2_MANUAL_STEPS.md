# Day 2 - Remaining Manual Steps

## ✅ Completed (Automated)

- [x] Generated JWT Secret: `ae30602c476d938679ef51ebd63affeb2ffb26188eedcffb4ff433a05bfdfee3`
- [x] Code committed and pushed to GitHub
- [x] CI/CD workflow created and triggered

---

## ⏳ In Progress

### Check GitHub Actions CI
1. Go to: https://github.com/Sudharsanv06/Mobile-Recharging-system/actions
2. Look for the workflow run from your latest push
3. Wait for it to complete (usually 3-5 minutes)
4. Ensure both jobs pass:
   - ✅ Backend Tests
   - ✅ Frontend Build

**Status**: ⏳ Check this now!

---

## 🔧 Manual Tasks (Follow in Order)

### 1. Setup MongoDB Atlas (10 minutes)

#### Create Cluster
- [ ] Go to https://cloud.mongodb.com
- [ ] Sign in / Sign up
- [ ] Create Database → FREE M0 tier
- [ ] Choose AWS, Region: closest to you
- [ ] Wait 3-5 minutes for cluster creation

#### Create User
- [ ] Security → Database Access → Add New Database User
- [ ] Username: `mobile-recharge-admin`
- [ ] Password: Generate and **SAVE IT**
- [ ] Privileges: Atlas Admin

#### Network Access
- [ ] Security → Network Access → Add IP Address
- [ ] Click "Allow Access from Anywhere" (0.0.0.0/0)
- [ ] Confirm

#### Get Connection String
- [ ] Deployment → Database → Connect
- [ ] Connect your application
- [ ] Copy connection string
- [ ] Replace `<username>` with `mobile-recharge-admin`
- [ ] Replace `<password>` with your password
- [ ] Add `/mobile-recharge` before the `?`

**Final format**:
```
mongodb+srv://mobile-recharge-admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mobile-recharge?retryWrites=true&w=majority
```

---

### 2. Setup Razorpay (5 minutes)

- [ ] Go to https://dashboard.razorpay.com
- [ ] Sign in / Sign up
- [ ] Settings → API Keys → Generate Test Key Pair
- [ ] **Copy and save**:
  - Key ID: `rzp_test_xxxxx`
  - Key Secret: `xxxxxxxxxxxxx`

**Note**: We'll create the webhook AFTER deploying to Render

---

### 3. Setup Twilio (Optional - 5 minutes)

- [ ] Go to https://console.twilio.com
- [ ] Sign up for free trial
- [ ] **Copy from dashboard**:
  - Account SID: `ACxxxxx`
  - Auth Token: (click to reveal)
- [ ] Phone Numbers → Buy a number (free trial includes one)
- [ ] Copy phone number: `+1xxxxxxxxxx`

**Skip if**: You don't want SMS notifications yet

---

### 4. Setup Gmail App Password (3 minutes)

- [ ] Go to https://myaccount.google.com/apppasswords
- [ ] Sign in to your Gmail account
- [ ] 2-Step Verification must be enabled
- [ ] Select App: Mail
- [ ] Select Device: Other → "Mobile Recharge"
- [ ] Generate
- [ ] **Copy 16-character password**: `xxxx xxxx xxxx xxxx`

---

### 5. Fill Environment Variables Template (5 minutes)

- [ ] Open: `RENDER_ENV_TEMPLATE.txt` (in your project folder)
- [ ] Fill in ALL values:
  - MongoDB URI from step 1
  - JWT Secret: `ae30602c476d938679ef51ebd63affeb2ffb26188eedcffb4ff433a05bfdfee3`
  - Razorpay keys from step 2
  - Twilio credentials from step 3 (or leave empty)
  - Gmail credentials from step 4
- [ ] **Save this file** (but DON'T commit to git!)

---

### 6. Deploy to Render (15 minutes)

#### Create Web Service
- [ ] Go to https://dashboard.render.com
- [ ] Sign up with GitHub (recommended)
- [ ] Dashboard → New + → Web Service
- [ ] Connect account (authorize GitHub)
- [ ] Find repository: `Mobile-Recharging-system`
- [ ] Click Connect

#### Configure Service
- [ ] **Name**: `mobile-recharge-backend`
- [ ] **Region**: Choose closest to you
- [ ] **Branch**: `main`
- [ ] **Root Directory**: `backend`
- [ ] **Runtime**: Node (auto-detected)
- [ ] **Build Command**: `npm ci`
- [ ] **Start Command**: `npm start`

#### Plan & Advanced
- [ ] **Instance Type**: Free (for testing)
- [ ] **Auto-Deploy**: ✅ Yes
- [ ] **Health Check Path**: `/health`

#### Environment Variables
- [ ] Click "Add Environment Variable"
- [ ] Click "Add from .env"
- [ ] Open `RENDER_ENV_TEMPLATE.txt`
- [ ] Copy ALL content
- [ ] Paste into Render
- [ ] Review variables
- [ ] Click "Save"

#### Deploy
- [ ] Click "Create Web Service"
- [ ] Watch logs (auto-opens)
- [ ] Wait 5-10 minutes

**Look for**:
```
==> Build successful
==> Starting server
Server running on port 10000
MongoDB connected
Socket.io initialized
```

- [ ] **Copy your service URL**: `https://mobile-recharge-backend-xxxxx.onrender.com`

---

### 7. Verify Deployment (5 minutes)

#### Test Health Endpoint

**In Browser**:
- [ ] Open: `https://[your-service].onrender.com/health`
- [ ] Should see JSON with `"status": "ok"`

**In Terminal**:
```bash
curl https://[your-service].onrender.com/health
```

**Expected**:
```json
{
  "success": true,
  "status": "ok",
  "version": "1.0.0",
  "uptime": 123.45,
  "timestamp": "2025-12-04T...",
  "env": "production"
}
```

#### Check Logs
- [ ] Render Dashboard → Your Service → Logs
- [ ] Look for "MongoDB connected"
- [ ] No error messages

#### Test API
**Using Postman/Thunder Client**:

```
POST https://[your-service].onrender.com/api/v1/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123!",
  "phone": "+1234567890"
}
```

- [ ] Returns 201 Created with token

#### Verify MongoDB
- [ ] MongoDB Atlas → Database → Browse Collections
- [ ] Database `mobile-recharge` exists
- [ ] Collection `users` has your test user

---

### 8. Configure Razorpay Webhook (10 minutes)

#### Create Webhook
- [ ] Razorpay Dashboard → Settings → Webhooks
- [ ] Click "Create New Webhook"
- [ ] **Webhook URL**: `https://[your-service].onrender.com/api/v1/payments/webhook`
- [ ] Click "Generate Secret" → **Copy the secret**
- [ ] **Active Events**:
  - [x] payment.authorized
  - [x] payment.captured
  - [x] payment.failed
- [ ] Click "Create Webhook"

#### Update Render Environment
- [ ] Render Dashboard → Your Service → Environment
- [ ] Find `RAZORPAY_WEBHOOK_SECRET`
- [ ] Click Edit
- [ ] Paste webhook secret from Razorpay
- [ ] Click "Save Changes"
- [ ] Service will redeploy (wait 2-3 minutes)

#### Test Webhook
- [ ] Razorpay Dashboard → Webhooks → Your webhook
- [ ] Click "Test Webhook"
- [ ] Event: `payment.captured`
- [ ] Send Test Webhook
- [ ] Check response: Should be 200 OK

**Check Render Logs**:
```
Webhook received: payment.captured
HMAC signature verified successfully
```

---

### 9. End-to-End Test (10 minutes)

#### Test Registration
- [ ] Use Postman to register a user

#### Test Login
- [ ] Login with registered user
- [ ] Copy JWT token

#### Test Protected Endpoint
```
GET https://[your-service].onrender.com/api/v1/users/profile
Authorization: Bearer [your-jwt-token]
```
- [ ] Returns user profile

#### Test Database
- [ ] MongoDB Atlas shows user data
- [ ] Collections created properly

---

## ✅ Day 2 Complete Checklist

- [ ] ✅ CI workflow passed on GitHub
- [ ] 🔧 MongoDB Atlas configured
- [ ] 🔧 Razorpay account setup
- [ ] 🔧 Twilio configured (optional)
- [ ] 🔧 Gmail app password created
- [ ] 🔧 Environment variables filled
- [ ] 🚀 Deployed to Render
- [ ] ✅ Health endpoint returns 200
- [ ] ✅ MongoDB connected (check logs)
- [ ] ✅ User registration works
- [ ] ✅ Login returns JWT
- [ ] 🔧 Razorpay webhook configured
- [ ] ✅ Webhook test passed
- [ ] ✅ No errors in logs

---

## 📝 Save These URLs

**Backend URL**: https://_____________________.onrender.com

**MongoDB URI**: mongodb+srv://mobile-recharge-admin:_____@cluster0._____.mongodb.net/mobile-recharge?retryWrites=true&w=majority

**Razorpay Keys**:
- Test Key ID: rzp_test_________________
- Test Secret: ________________

**GitHub Actions**: https://github.com/Sudharsanv06/Mobile-Recharging-system/actions

---

## 🚨 Troubleshooting

### Build Failed
- Check Render logs for specific error
- Verify `backend` folder path is correct
- Ensure `package.json` exists in backend folder

### MongoDB Connection Failed
- Verify connection string format
- Check password has no special characters or is URL-encoded
- Confirm IP whitelist includes 0.0.0.0/0

### Webhook 400 Error
- Verify webhook secret matches exactly
- Check if service redeployed after adding secret
- Review Render logs for signature errors

---

## 🎯 Next: Day 3

Once all checkboxes above are ✅, you're ready for:
- Deploy frontend to Vercel
- Connect frontend to backend
- Update ALLOWED_ORIGINS
- Test complete flow
- Go live!

---

**Current Status**: Day 2 - Manual configuration phase
**Estimated Remaining Time**: 60-75 minutes (depending on account setups)
