# Mobile Recharge Application

A full-stack MERN application for mobile recharge services with real-time notifications, payment integration, and admin dashboard.

## 🚀 Quick Start

### Development
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd client
npm install
npm run dev
```

### Testing
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd client
npm test
```

## 📦 Deployment

**Ready to deploy?** Follow our comprehensive deployment guide:

- 📋 [**Day 1 Deployment Checklist**](./DAY1_DEPLOYMENT_CHECKLIST.md) - Complete setup guide
- 📄 [**Day 1 Summary**](./DAY1_SUMMARY.md) - Quick reference

### Prerequisites Completed ✅
- Health endpoint configured
- Webhook HMAC verification
- Environment variables documented
- Production build tested
- All tests passing

### Deployment Targets
- **Backend**: [Render](https://render.com) - Node.js web service
- **Frontend**: [Vercel](https://vercel.com) - Static site deployment
- **Database**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

### Environment Variables

See configuration templates:
- Backend: [`backend/.env.example`](./backend/.env.example)
- Frontend: [`client/.env.example`](./client/.env.example)

## 🏗️ Architecture

- **Backend**: Node.js, Express, MongoDB, Socket.io
- **Frontend**: React, Vite, React Router
- **Payment**: Razorpay integration
- **Notifications**: Twilio SMS, Nodemailer email, Socket.io real-time
- **Security**: JWT auth, rate limiting, Helmet, CORS

## 📚 Documentation

- [Setup Instructions](./SETUP_INSTRUCTIONS.md)
- [Twilio Setup](./TWILIO_SETUP.md)
- [Operator Components Guide](./OPERATOR_COMPONENTS_GUIDE.md)
- [Dashboard Improvements](./DASHBOARD_IMPROVEMENTS.md)

## 🔧 Tech Stack

### Backend
- Express 5.x
- MongoDB with Mongoose
- JWT Authentication
- Razorpay Payment Gateway
- Socket.io for real-time features
- Winston logging
- Jest & Supertest for testing

### Frontend
- React 18
- Vite
- React Router 7
- Axios
- Socket.io-client
- Vitest & Playwright for testing

## 📝 License

ISC

## 👥 Contributors

Maintained by the Mobile Recharge Team