# Production Pre-Flight Checklist

Run these checks before deploying to production.

## ✅ Quick 3-Minute Verification

### 1. PORT Environment Variable
```bash
node -e "console.log(process.env.PORT || 'no PORT')"
```
**Expected**: Should output "no PORT" (will be set by Render)  
**Status**: ✅ PASS - Server uses `process.env.PORT || 5000`

---

### 2. No Secrets in Repository
```bash
git grep -E '(rzp_live_|rzp_test_[a-zA-Z0-9]{14})' --cached
```
**Expected**: No matches (except in .env.example as placeholders)  
**Status**: ✅ PASS - Only mock values and placeholders found

---

### 3. Health Endpoint Works
```bash
# After starting server locally
curl http://localhost:5000/health
```
**Expected**: JSON with `status: 'ok'`, version, uptime  
**Status**: ✅ Ready to test

---

## 🔐 Security Checks

### Environment Variables
- ✅ `.env.example` contains all required variables
- ✅ No actual secrets committed to git
- ✅ JWT_SECRET generation command documented
- ✅ Razorpay webhook secret documented

### CORS Configuration
- ✅ Development mode: allows all origins
- ✅ Production mode: validates against ALLOWED_ORIGINS
- ✅ **NEW**: Wildcard support for Vercel previews (e.g., `https://*.vercel.app`)
- ✅ Credentials support enabled for auth headers/cookies

### Webhook Security
- ✅ Raw body handler registered BEFORE express.json()
- ✅ HMAC signature verification implemented
- ✅ Webhook route: `/api/v1/payments/webhook`

---

## 🧪 Test Coverage

### Backend Tests
```bash
cd backend && npm test
```
**Status**: ✅ 4 suites, 9 tests passing, 50%+ coverage

### Frontend Build
```bash
cd client && npm run build
```
**Status**: ✅ Builds successfully in 8.61s

---

## 📋 Environment Variables Checklist

### Backend (Render)
Copy from `backend/.env.example`:

- [ ] `NODE_ENV=production`
- [ ] `PORT` (auto-set by Render)
- [ ] `MONGODB_URI` (MongoDB Atlas connection string)
- [ ] `JWT_SECRET` (32+ character secret)
- [ ] `RAZORPAY_KEY_ID` (rzp_live_*)
- [ ] `RAZORPAY_KEY_SECRET`
- [ ] `RAZORPAY_WEBHOOK_SECRET`
- [ ] `TWILIO_ACCOUNT_SID`
- [ ] `TWILIO_AUTH_TOKEN`
- [ ] `TWILIO_PHONE_NUMBER`
- [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`
- [ ] `EMAIL_FROM`
- [ ] `ALLOWED_ORIGINS` (include Vercel URLs with wildcards)
- [ ] `SENTRY_DSN` (optional)

### Frontend (Vercel)
Copy from `client/.env.example`:

- [ ] `VITE_API_URL` (your Render backend URL)
- [ ] `VITE_RAZORPAY_KEY_ID` (optional, for client display)

---

## 🌐 CORS Configuration Examples

### For Vercel Deployment
```bash
ALLOWED_ORIGINS=https://myapp.vercel.app,https://myapp-*.vercel.app,https://www.myapp.com
```

### With Preview Branches
```bash
ALLOWED_ORIGINS=https://myapp-git-*.vercel.app,https://myapp-*.vercel.app,https://myapp.vercel.app
```

The wildcard `*` will match any subdomain, perfect for Vercel preview deployments.

---

## 🔄 Post-Deployment Configuration

After deploying backend to Render:

1. **Update Razorpay Webhook**
   - Go to: https://dashboard.razorpay.com/app/webhooks
   - Set URL: `https://your-backend.onrender.com/api/v1/payments/webhook`
   - Events: `payment.captured`, `payment.failed`

2. **MongoDB Atlas IP Whitelist**
   - Option A: Whitelist `0.0.0.0/0` (allow all)
   - Option B: Add Render's IP addresses
   - Go to: Network Access → IP Access List

3. **Test Health Endpoint**
   ```bash
   curl https://your-backend.onrender.com/health
   ```

4. **Verify Frontend Connects**
   - Open Vercel deployment
   - Check browser console for API connection
   - Test login/registration

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error
**Solution**: Check `ALLOWED_ORIGINS` includes your frontend URL with proper wildcard pattern

### Issue: Webhook Signature Fails
**Solution**: Verify `RAZORPAY_WEBHOOK_SECRET` matches Razorpay dashboard

### Issue: MongoDB Connection Fails
**Solution**: Check MongoDB Atlas IP whitelist and connection string format

### Issue: SMS Not Sending
**Solution**: Verify all three Twilio env vars are set correctly

---

## ✅ Final Checklist Before Deploy

- [x] All tests passing locally
- [x] Production build successful
- [x] Environment variables documented
- [x] No secrets in repository
- [x] Health endpoint implemented
- [x] Webhook security configured
- [x] CORS wildcard support added
- [x] README updated with deployment links
- [ ] MongoDB Atlas configured
- [ ] Razorpay account ready
- [ ] Twilio account ready
- [ ] SMTP credentials ready

---

**Status**: ✅ Ready for Day 2 Deployment  
**Next Steps**: Follow [DAY1_DEPLOYMENT_CHECKLIST.md](./DAY1_DEPLOYMENT_CHECKLIST.md) for actual deployment
