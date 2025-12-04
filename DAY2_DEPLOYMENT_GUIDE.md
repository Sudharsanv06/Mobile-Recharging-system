# Day 2 - Backend Deployment to Render

**Goal**: Deploy backend, confirm health, and enable webhooks

---

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] GitHub account with this repository pushed
- [ ] Render account (free tier available at https://render.com)
- [ ] MongoDB Atlas account with cluster created
- [ ] Razorpay account with API keys
- [ ] Twilio account with credentials
- [ ] Gmail account with app password

---

## Step 1: MongoDB Atlas Setup (10 minutes)

### 1.1 Create MongoDB Atlas Cluster

1. Go to https://cloud.mongodb.com
2. Click "Build a Database" → Choose "FREE" (M0 Sandbox)
3. Select a cloud provider and region (choose closest to your users)
4. Click "Create Cluster"

### 1.2 Create Database User

1. Security → Database Access → Add New Database User
2. Authentication Method: Password
3. Username: `mobile-recharge-user`
4. Password: Generate secure password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access

1. Security → Network Access → Add IP Address
2. **Option A (Recommended for testing)**: Click "Allow Access from Anywhere" (0.0.0.0/0)
3. **Option B (More secure)**: Add Render's IP ranges (see Render docs)
4. Click "Confirm"

### 1.4 Get Connection String

1. Deployment → Database → Click "Connect"
2. Choose "Connect your application"
3. Driver: Node.js, Version: 5.5 or later
4. Copy the connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` and `<password>` with your credentials
6. Add database name: `/mobile-recharge` before the `?`
   ```
   mongodb+srv://mobile-recharge-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mobile-recharge?retryWrites=true&w=majority
   ```

**Save this connection string - you'll need it for Render!**

---

## Step 2: Prepare Environment Variables

Create a file (NOT in git) with all your environment variables ready to copy:

```bash
# Server
NODE_ENV=production
PORT=10000

# Database
MONGODB_URI=mongodb+srv://mobile-recharge-user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/mobile-recharge?retryWrites=true&w=majority

# JWT Secret (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=your_generated_64_character_hex_string_here

# Razorpay (get from https://dashboard.razorpay.com/app/keys)
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_dashboard

# Twilio (get from https://console.twilio.com/)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Email (Gmail App Password: https://myaccount.google.com/apppasswords)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
EMAIL_FROM=noreply@yourapp.com

# CORS (will update after frontend deployment)
ALLOWED_ORIGINS=http://localhost:5173,https://*.vercel.app

# Optional
SENTRY_DSN=your_sentry_dsn_if_you_have_one
```

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## Step 3: Deploy to Render (15 minutes)

### 3.1 Create Web Service

1. Go to https://dashboard.render.com
2. Click "New +" → "Web Service"
3. Connect your GitHub account if not already connected
4. Find and select your `Mobile-Recharging-system` repository
5. Click "Connect"

### 3.2 Configure Service

**Basic Settings:**
- Name: `mobile-recharge-backend` (or your preferred name)
- Region: Choose closest to your users
- Branch: `main`
- Root Directory: `backend`
- Runtime: `Node`

**Build & Deploy:**
- Build Command: `npm install`
- Start Command: `npm start`

**Instance Type:**
- Select "Free" (0.1 CPU, 512 MB RAM) for testing
- Can upgrade to paid plans later

### 3.3 Set Environment Variables

1. Scroll down to "Environment Variables"
2. Click "Add Environment Variable"
3. Add each variable from your prepared list:

**Quick Add Method:**
- Click "Add from .env" 
- Paste all your environment variables at once
- Review and confirm

**Manual Add Method:**
- Add one by one:
  - Key: `NODE_ENV`, Value: `production`
  - Key: `MONGODB_URI`, Value: `your-connection-string`
  - Key: `JWT_SECRET`, Value: `your-generated-secret`
  - (Continue for all variables)

### 3.4 Advanced Settings

1. Scroll to "Health Check Path"
2. Set to: `/health`
3. This tells Render to monitor your health endpoint

### 3.5 Auto Deploy

- Enable "Auto-Deploy" - Render will deploy on every push to main branch

### 3.6 Create Web Service

1. Click "Create Web Service"
2. Render will start building and deploying
3. Wait 5-10 minutes for first deployment

---

## Step 4: Monitor Deployment (5 minutes)

### 4.1 Watch Build Logs

1. In Render dashboard, click on your service
2. Go to "Logs" tab
3. Watch for:
   ```
   ==> Building...
   ==> Installing dependencies
   ==> Running npm install
   ==> Starting server
   Server running on port 10000
   MongoDB connected
   Socket.io initialized
   ```

### 4.2 Check for Errors

Look for any errors in logs:
- ❌ MongoDB connection failed → Check MONGODB_URI
- ❌ Missing env vars → Add missing variables
- ❌ Port binding issues → Should auto-resolve
- ✅ "Server running on port" → Success!

### 4.3 Service URL

Once deployed, Render provides a URL:
```
https://mobile-recharge-backend.onrender.com
```
**Copy this URL - you'll need it!**

---

## Step 5: Verify Deployment (5 minutes)

### 5.1 Test Health Endpoint

Open in browser or use curl:
```bash
curl https://mobile-recharge-backend.onrender.com/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "ok",
  "version": "1.0.0",
  "uptime": 123.456,
  "timestamp": "2025-12-04T10:30:00.000Z",
  "env": "production"
}
```

### 5.2 Test API Endpoints

**Test Operators Endpoint:**
```bash
curl https://mobile-recharge-backend.onrender.com/api/v1/operators
```

**Test Registration (Postman/Thunder Client):**
```bash
POST https://mobile-recharge-backend.onrender.com/api/v1/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123!",
  "phone": "+1234567890"
}
```

### 5.3 Check Database Connection

1. Go to MongoDB Atlas dashboard
2. Click on your cluster → "Collections"
3. You should see the `mobile-recharge` database
4. After registration test, you should see a `users` collection

---

## Step 6: Configure Razorpay Webhook (10 minutes)

### 6.1 Get Webhook URL

Your webhook URL is:
```
https://mobile-recharge-backend.onrender.com/api/v1/payments/webhook
```

### 6.2 Configure in Razorpay Dashboard

1. Go to https://dashboard.razorpay.com
2. Settings → Webhooks → Add Webhook
3. Webhook URL: `https://mobile-recharge-backend.onrender.com/api/v1/payments/webhook`
4. Secret: Generate a strong secret (save it!)
5. Active Events - Select:
   - ✅ `payment.authorized`
   - ✅ `payment.captured`
   - ✅ `payment.failed`
6. Click "Create Webhook"

### 6.3 Update Render Environment Variable

1. Go to Render dashboard → Your service → Environment
2. Find `RAZORPAY_WEBHOOK_SECRET`
3. Update with the secret from Razorpay
4. Click "Save Changes"
5. Service will auto-redeploy

### 6.4 Test Webhook

**In Razorpay Dashboard:**
1. Go to Webhooks → Your webhook → "Test Webhook"
2. Select event: `payment.captured`
3. Click "Send Test Webhook"
4. Check response:
   - ✅ Status 200 → Success
   - ❌ Status 400/500 → Check Render logs

**Check Render Logs:**
```
Webhook received: payment.captured
Signature verified successfully
Payment processed
```

---

## Step 7: Configure Twilio (Optional - for SMS)

### 7.1 Twilio Setup

1. Go to https://console.twilio.com
2. Get Account SID and Auth Token
3. Get a Twilio phone number
4. Update environment variables in Render if not already set

### 7.2 Test SMS

Make a test recharge and verify SMS is sent to the mobile number.

---

## Step 8: Final Verification Checklist

- [ ] Health endpoint returns 200 OK
- [ ] MongoDB connection successful (check logs)
- [ ] User registration works
- [ ] User login works and returns JWT
- [ ] JWT authentication works on protected endpoints
- [ ] Razorpay webhook responds with 200
- [ ] HMAC signature verification works
- [ ] SMS notifications send (if Twilio configured)
- [ ] Email notifications send (if SMTP configured)
- [ ] No errors in Render logs

---

## Step 9: Update ALLOWED_ORIGINS (After Frontend Deploy)

After you deploy frontend to Vercel (Day 3), update CORS:

1. Render dashboard → Your service → Environment
2. Update `ALLOWED_ORIGINS`:
   ```
   https://your-app.vercel.app,https://*.vercel.app
   ```
3. Save changes (auto-redeploys)

---

## Troubleshooting

### Issue: MongoDB Connection Failed
**Solution:**
- Check MONGODB_URI format
- Verify username/password are correct
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Ensure database name is included in URI

### Issue: Port Binding Error
**Solution:**
- Render automatically sets PORT
- Make sure your server uses `process.env.PORT`
- Check server.js: `const PORT = process.env.PORT || 5000;`

### Issue: Environment Variables Not Loading
**Solution:**
- Go to Render → Environment → Verify all vars are set
- Check for typos in variable names
- Sensitive variables should be marked as "Secret"

### Issue: Health Check Failing
**Solution:**
- Verify path is `/health` not `/api/v1/health`
- Check logs for startup errors
- Ensure server is listening on 0.0.0.0 not localhost

### Issue: Webhook Signature Verification Fails
**Solution:**
- Verify RAZORPAY_WEBHOOK_SECRET matches Razorpay dashboard
- Check webhook raw body handling in app.js
- Review Render logs for signature mismatch errors

### Issue: CORS Errors
**Solution:**
- Update ALLOWED_ORIGINS with your frontend URL
- Include wildcard for preview: `https://*.vercel.app`
- Check logs for rejected origins

---

## Performance Tips

### Cold Start Issues (Free Tier)
- Free Render instances spin down after 15 minutes of inactivity
- First request after spin down takes 30-60 seconds
- Consider upgrading to paid plan ($7/mo) for always-on

### Optimize Startup Time
- Minimize dependencies
- Use connection pooling for MongoDB
- Implement lazy loading where possible

---

## Security Checklist

- [ ] All secrets in Render environment variables (not in code)
- [ ] ALLOWED_ORIGINS configured (not allowing all origins)
- [ ] MongoDB user has minimal required permissions
- [ ] JWT_SECRET is 32+ characters
- [ ] HTTPS only (Render provides SSL automatically)
- [ ] Webhook signature verification enabled
- [ ] Rate limiting configured in app

---

## Monitoring & Alerts

### Enable Render Notifications
1. Render dashboard → Account Settings → Notifications
2. Enable:
   - Deploy started
   - Deploy failed
   - Deploy succeeded
   - Service suspended

### Monitor Logs
- Set up log streaming to external service (optional)
- Check logs daily for errors
- Monitor health check status

---

## Cost Estimates

**Free Tier:**
- Render Web Service: Free (750 hrs/month)
- MongoDB Atlas: Free (M0, 512 MB)
- Razorpay: Free (transaction fees apply)
- Twilio: Pay per SMS (~$0.0079/SMS)

**Paid Plans (Optional):**
- Render Starter: $7/month (no cold starts)
- MongoDB M10: $0.08/hour (~$57/month)
- Redis Cloud: $5/month

---

## Next Steps

✅ Backend deployed and healthy
✅ Database connected
✅ Webhooks configured

**Ready for Day 3**: Deploy frontend to Vercel and connect to this backend!

---

## Quick Reference

**Your Backend URL:**
```
https://mobile-recharge-backend.onrender.com
```

**Important Endpoints:**
- Health: `GET /health`
- Register: `POST /api/v1/auth/register`
- Login: `POST /api/v1/auth/login`
- Webhook: `POST /api/v1/payments/webhook`

**Save these for Day 3:**
- [ ] Backend URL
- [ ] MongoDB connection successful
- [ ] Razorpay webhook configured
- [ ] All environment variables set

---

**Deployment Status**: ⏳ Ready to Begin
**Estimated Time**: 45-60 minutes
**Difficulty**: Medium

**Let's deploy! 🚀**
