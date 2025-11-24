const operatorController = require('../controllers/operatorController');
const Operator = require('../models/Operator');

jest.mock('../models/Operator', () => ({
  find: jest.fn(),
  findById: jest.fn(),
}));

describe('operatorController.getAllOperators', () => {
  it('returns operator list', async () => {
    const req = { query: {} };
    const res = { json: jest.fn(), status: jest.fn().mockReturnThis() };
    // Operator.find(...).lean() is used in the controller; mock chain accordingly
    Operator.find.mockImplementation(() => ({ lean: jest.fn().mockResolvedValue([{ _id: 'o1', name: 'Airtel' }]) }));
    await operatorController.getAllOperators(req, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [{ _id: 'o1', name: 'Airtel' }] });
  });
});
