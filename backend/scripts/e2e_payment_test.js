const axios = require('axios');

async function run() {
  try {
    const base = process.env.API_BASE || 'http://localhost:5000';
    const ts = Math.floor(Date.now() / 1000);
    const email = `e2e+${ts}@example.com`;
    const phone = `9999${String(ts).slice(0,6)}`;

    console.log('Registering test user', { email, phone });
    const reg = await axios.post(`${base}/api/v1/auth/register`, {
      name: 'E2E Tester',
      email,
      phone,
      password: 'Password123',
    });
    const token = reg.data?.data?.token;
    if (!token) throw new Error('No token returned from register');
    console.log('Token obtained (length):', token.length);

    console.log('Fetching operators...');
    const ops = await axios.get(`${base}/api/v1/operators`);
    const operatorId = ops.data?.data?.[0]?._id;
    if (!operatorId) throw new Error('No operators found');
    console.log('Selected operatorId:', operatorId);

    console.log('Creating recharge (razorpay)...');
    const rechargeRes = await axios.post(
      `${base}/api/v1/recharges`,
      { operatorId, mobileNumber: '9999999999', amount: 149, paymentMethod: 'razorpay' },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const rechargeId = rechargeRes.data?.data?._id;
    console.log('Recharge created:', rechargeId);

    console.log('Creating Razorpay order...');
    const orderRes = await axios.post(
      `${base}/api/v1/payments/create-order`,
      { amount: 149, rechargeId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('Create-order response:', orderRes.data);
    const orderId = orderRes.data?.data?.orderId;
    const keyId = orderRes.data?.data?.keyId;

    if ((orderId && orderId.startsWith('order_mock_')) || keyId === 'rzp_test_mock') {
      console.log('Detected dev/mock order — simulating verify call');
      const mockPaymentId = `pay_mock_${Date.now()}`;
      const verifyRes = await axios.post(
        `${base}/api/v1/payments/verify`,
        { orderId, paymentId: mockPaymentId, signature: 'mock_signature', rechargeId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Verify response:', verifyRes.data);
    } else {
      console.log('Non-mock order created. Open checkout in browser to complete payment.');
    }

    console.log('E2E script completed.');
  } catch (err) {
    console.error('E2E test failed:', err.response?.data || err.message);
    process.exit(1);
  }
}

if (require.main === module) run();
