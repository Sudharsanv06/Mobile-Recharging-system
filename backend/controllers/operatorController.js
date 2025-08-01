const Operator = require('../models/Operator');

// Get all operators
exports.getAllOperators = async (req, res) => {
  try {
    const operators = await Operator.find();
    res.json(operators);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
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