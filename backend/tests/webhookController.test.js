const crypto = require('crypto');

const { verifyWebhook } = require('../controllers/webhookController');

describe('webhookController.verifyWebhook', () => {
  const oldEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...oldEnv };
    process.env.RAZORPAY_WEBHOOK_SECRET = 'whsec_test_secret';
  });

  afterEach(() => {
    process.env = oldEnv;
  });

  it('calls next on valid signature', () => {
    const payload = { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_123' } } } };
    const raw = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET).update(raw).digest('hex');

    const req = { rawBody: raw, body: payload, headers: { 'x-razorpay-signature': signature } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyWebhook(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it('returns 400 on invalid signature', () => {
    const payload = { event: 'payment.captured', payload: { payment: { entity: { id: 'pay_123' } } } };
    const raw = JSON.stringify(payload);
    const badSignature = 'bad_signature';

    const req = { rawBody: raw, body: payload, headers: { 'x-razorpay-signature': badSignature } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    verifyWebhook(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
    expect(next).not.toHaveBeenCalled();
  });
});
