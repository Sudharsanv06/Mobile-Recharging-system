const Operator = require('../models/Operator');

// Get all operators with optional filters: ?type=&circle=&q=
exports.getAllOperators = async (req, res) => {
  try {
    const { type, circle, q } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (circle) filter.circle = circle;
    if (q) filter.name = { $regex: q, $options: 'i' };

    const operators = await Operator.find(filter).lean();
    return res.json({ success: true, data: operators });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get operator by ID
exports.getOperatorById = async (req, res) => {
  try {
    const operator = await Operator.findById(req.params.id);
    if (!operator) {
      return res.status(404).json({ msg: 'Operator not found' });
    }
    res.json(operator);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Operator not found' });
    }
    res.status(500).send('Server error');
  }
};

// Add new operator (Admin only)
exports.addOperator = async (req, res) => {
  try {
    const { name, logo, plans } = req.body;

    const operator = new Operator({
      name,
      logo,
      plans,
    });

    await operator.save();
    res.json(operator);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};