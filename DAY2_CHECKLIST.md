# Day 2 Quick Deployment Checklist

## Pre-Deployment (15 min)

### 1. Generate Secrets
```bash
cd backend
node scripts/generate-jwt-secret.js
```
Copy the generated JWT_SECRET ✅

### 2. MongoDB Atlas
- [ ] Account created: https://cloud.mongodb.com
- [ ] Cluster created (M0 Free tier)
- [ ] Database user created
- [ ] Network access: 0.0.0.0/0 allowed
- [ ] Connection string copied
- [ ] Format: `mongodb+srv://user:pass@cluster.net/mobile-recharge?retryWrites=true&w=majority`

### 3. Razorpay
- [ ] Account created: https://dashboard.razorpay.com
- [ ] API Keys obtained (test or live)
- [ ] RAZORPAY_KEY_ID copied
- [ ] RAZORPAY_KEY_SECRET copied

### 4. Twilio (Optional for SMS)
- [ ] Account created: https://console.twilio.com
- [ ] Phone number obtained
- [ ] TWILIO_ACCOUNT_SID copied
- [ ] TWILIO_AUTH_TOKEN copied
- [ ] TWILIO_PHONE_NUMBER copied

### 5. Gmail App Password
- [ ] Go to: https://myaccount.google.com/apppasswords
- [ ] Generate app password
- [ ] 16-character password copied

---

## Deployment to Render (20 min)

### 1. Create Web Service
- [ ] Go to https://dashboard.render.com
- [ ] New → Web Service
- [ ] Connect GitHub repo: `Mobile-Recharging-system`
- [ ] Select `main` branch

### 2. Configure Service
**Basic:**
- [ ] Name: `mobile-recharge-backend`
- [ ] Region: (choose closest)
- [ ] Root Directory: `backend`
- [ ] Runtime: `Node`

**Build & Deploy:**
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`

**Advanced:**
- [ ] Health Check Path: `/health`
- [ ] Auto-Deploy: ✅ Enabled

### 3. Environment Variables
Copy this template and fill in your values:

```bash
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://user:pass@cluster.net/mobile-recharge?retryWrites=true&w=majority
JWT_SECRET=[your-generated-64-char-secret]
RAZORPAY_KEY_ID=rzp_live_xxxxx
RAZORPAY_KEY_SECRET=[your-secret]
RAZORPAY_WEBHOOK_SECRET=[generate-later]
TWILIO_ACCOUNT_SID=ACxxxxx
TWILIO_AUTH_TOKEN=[your-token]
TWILIO_PHONE_NUMBER=+1234567890
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=[16-char-app-password]
EMAIL_FROM=noreply@yourapp.com
ALLOWED_ORIGINS=http://localhost:5173,https://*.vercel.app
```

**In Render:**
- [ ] Click "Add Environment Variable"
- [ ] Click "Add from .env"
- [ ] Paste all variables
- [ ] Review and save

### 4. Deploy
- [ ] Click "Create Web Service"
- [ ] Wait 5-10 minutes
- [ ] Watch logs for "Server running on port"

---

## Verification (10 min)

### 1. Note Your Service URL
```
https://[your-service-name].onrender.com
```
URL: ________________________________

### 2. Test Health Endpoint
```bash
curl https://[your-service-name].onrender.com/health
```
- [ ] Returns 200 OK
- [ ] Response has `"status": "ok"`

### 3. Test in Browser
Open: `https://[your-service-name].onrender.com/health`
- [ ] JSON response visible

### 4. Check Logs
Render Dashboard → Your Service → Logs
- [ ] "Server running on port 10000"
- [ ] "MongoDB connected"
- [ ] "Socket.io initialized"
- [ ] No error messages

### 5. Test Registration
Using Postman/Thunder Client:
```
POST https://[your-service-name].onrender.com/api/v1/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "Test123!",
  "phone": "+1234567890"
}
```
- [ ] Returns 201 Created
- [ ] Token received

### 6. Verify MongoDB
MongoDB Atlas → Clusters → Browse Collections
- [ ] Database `mobile-recharge` exists
- [ ] Collection `users` has 1 document

---

## Configure Razorpay Webhook (10 min)

### 1. Create Webhook
Razorpay Dashboard → Settings → Webhooks
- [ ] Click "Add Webhook"
- [ ] URL: `https://[your-service-name].onrender.com/api/v1/payments/webhook`
- [ ] Generate webhook secret (copy it!)
- [ ] Events selected:
  - [ ] payment.authorized
  - [ ] payment.captured
  - [ ] payment.failed
- [ ] Click "Create Webhook"

### 2. Update Render Environment
Render Dashboard → Your Service → Environment
- [ ] Find `RAZORPAY_WEBHOOK_SECRET`
- [ ] Paste webhook secret from Razorpay
- [ ] Click "Save Changes"
- [ ] Wait for auto-redeploy (~2 min)

### 3. Test Webhook
Razorpay Dashboard → Webhooks → Test Webhook
- [ ] Select event: `payment.captured`
- [ ] Click "Send Test Webhook"
- [ ] Response shows: 200 OK
- [ ] Check Render logs for "Webhook received"

---

## Post-Deployment (5 min)

### 1. Save Important URLs
```
Backend URL: https://[your-service-name].onrender.com
Health Check: https://[your-service-name].onrender.com/health
MongoDB URI: mongodb+srv://...
```

### 2. Document Credentials
**DO NOT COMMIT TO GIT!** Save in password manager:
- [ ] MongoDB connection string
- [ ] JWT secret
- [ ] Razorpay keys
- [ ] Twilio credentials
- [ ] SMTP password
- [ ] Webhook secret

### 3. Update README
Add to README.md (if needed):
- [ ] Backend URL
- [ ] API documentation link
- [ ] Deployment status badge

---

## Troubleshooting

### ❌ Build Failed
**Check:**
- Is `backend` directory correct?
- Are `package.json` and `package-lock.json` in backend folder?
- Check build logs for specific error

### ❌ MongoDB Connection Failed
**Check:**
- Is connection string correct?
- Did you replace `<password>` with actual password?
- Is IP whitelist set to 0.0.0.0/0?
- Did you add database name `/mobile-recharge`?

### ❌ Health Check Failing
**Check:**
- Is path set to `/health` not `/api/v1/health`?
- Is server starting successfully? (check logs)
- Wait 2-3 minutes after deployment

### ❌ Webhook Returns 400
**Check:**
- Is `RAZORPAY_WEBHOOK_SECRET` set correctly?
- Did service redeploy after adding secret?
- Check Render logs for signature errors

---

## Success Criteria

✅ **All these should be true:**
- [ ] Health endpoint returns 200
- [ ] MongoDB shows connected in logs
- [ ] User registration works
- [ ] Login returns JWT token
- [ ] Webhook responds with 200
- [ ] No errors in Render logs
- [ ] Service URL accessible from browser

---

## Next Steps

✅ Day 2 Complete!

**Ready for Day 3:**
- [ ] Backend URL saved
- [ ] All services working
- [ ] Environment variables set
- [ ] Webhooks configured

**Day 3:** Deploy frontend to Vercel

---

## Time Tracking

| Task | Estimated | Actual |
|------|-----------|--------|
| MongoDB Setup | 10 min | ___ |
| Gather Credentials | 10 min | ___ |
| Render Configuration | 15 min | ___ |
| First Deployment | 10 min | ___ |
| Verification | 10 min | ___ |
| Webhook Setup | 10 min | ___ |
| **Total** | **~65 min** | ___ |

---

**Started**: ___________  
**Completed**: ___________  
**Status**: ⏳ In Progress / ✅ Complete
