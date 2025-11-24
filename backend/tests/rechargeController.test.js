// Mock socket helpers before requiring controller to avoid real socket usage in tests
jest.mock('../config/socket', () => ({ emitToUser: jest.fn(), createAndEmitNotification: jest.fn() }));
const rechargeController = require('../controllers/rechargeController');
const Recharge = require('../models/Recharge');
const User = require('../models/User');
const Operator = require('../models/Operator');
const sendSMS = require('../utils/sendSMS');

jest.mock('../models/Recharge', () => jest.fn().mockImplementation(function (data) { this.save = jest.fn().mockResolvedValue(this); Object.assign(this, data); }));

jest.mock('../models/User', () => ({ findById: jest.fn() }));
jest.mock('../models/Operator', () => ({ findById: jest.fn() }));
jest.mock('../utils/sendSMS', () => jest.fn(() => Promise.resolve(true)));

describe('rechargeController.createRecharge', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns 404 when user not found', async () => {
    User.findById.mockResolvedValue(null);
    const req = { body: { amount: 100, mobileNumber: '9999999999' }, user: { id: 'u1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await rechargeController.createRecharge(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('creates recharge with amount only', async () => {
    User.findById.mockResolvedValue({ _id: 'u1', phone: '9999999999', save: jest.fn().mockResolvedValue(true) });
    Operator.findById.mockResolvedValue(null);
    const req = { body: { amount: 150, mobileNumber: '9991112222' }, user: { id: 'u1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await rechargeController.createRecharge(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
    expect(sendSMS).toHaveBeenCalled();
  });
});
