const sendSMS = require('../utils/sendSMS');
jest.mock('../utils/sendSMS', () => jest.fn(() => Promise.resolve(true)));

// Provide a mock User model factory for Jest. We use a factory function inside jest.mock
// so the mock call doesn't get hoisted before local variables are initialized.
jest.mock('../models/User', () => {
  const findOne = jest.fn();
  const findById = jest.fn();
  const UserMock = jest.fn().mockImplementation(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(this);
  });
  UserMock.findOne = findOne;
  UserMock.findById = findById;
  return UserMock;
});

const jwt = require('jsonwebtoken');
jest.mock('jsonwebtoken', () => ({
  sign: jest.fn((...args) => {
    const last = args[args.length - 1];
    if (typeof last === 'function') {
      // callback-style usage (login)
      return last(null, 'testtok');
    }
    // synchronous-style usage (register)
    return 'testtok';
  }),
}));

const authController = require('../controllers/authController');
const User = require('../models/User');

describe('authController.register', () => {
  beforeEach(() => {
    User.findOne.mockReset();
    User.findById.mockReset();
    User.mockClear();
    jwt.sign.mockClear();
  });

  it('should register a new user and return token', async () => {
    User.findOne.mockResolvedValue(null);

    const req = { body: { name: 'Alice', email: 'a@a.com', phone: '9999999999', password: 'Pass123' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await authController.register(req, res);

    expect(User).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('authController.login', () => {
  it('should return 400 when user not found', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const req = { body: { emailOrUsername: 'nope', password: 'x' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('should login successfully with correct password', async () => {
    const fakeUser = {
      _id: 'u1',
      name: 'Bob',
      email: 'b@b.com',
      phone: '8888888888',
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findOne = jest.fn().mockResolvedValue(fakeUser);

    const req = { body: { emailOrUsername: 'b@b.com', password: 'Pass123' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await authController.login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});

describe('authController.verifyOTP', () => {
  it('should verify OTP successfully', async () => {
    const user = { id: 'u1', otp: '1234', otpExpires: new Date(Date.now() + 10000), save: jest.fn() };
    User.findById = jest.fn().mockResolvedValue(user);
    const req = { body: { otp: '1234' }, user: { id: 'u1' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    await authController.verifyOTP(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Phone number verified successfully' });
  });
});
