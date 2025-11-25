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

// Get operator by ID or by name/slug fallback
exports.getOperatorById = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to find by ObjectId first
    let operator = null;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      operator = await Operator.findById(id);
    }

    // Fallback: try by name (case-insensitive)
    if (!operator) {
      operator = await Operator.findOne({ name: { $regex: `^${id}$`, $options: 'i' } });
    }

    if (!operator) {
      return res.status(404).json({ msg: 'Operator not found' });
    }

    res.json(operator);
  } catch (err) {
    console.error(err.message);
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