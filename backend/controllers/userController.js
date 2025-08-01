const User = require('../models/User');
const Recharge = require('../models/Recharge');

// Get user profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -otp -otpExpires');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update user balance
exports.updateBalance = async (req, res) => {
  try {
    const { amount } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.balance += amount;
    await user.save();

    res.json({ balance: user.balance });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user recharge history
exports.getRechargeHistory = async (req, res) => {
  try {
    const recharges = await Recharge.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate('operator', 'name logo');
    res.json(recharges);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get user statistics
exports.getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const totalRecharges = await Recharge.countDocuments({ user: req.user.id });
    const totalSpent = await Recharge.aggregate([
      { $match: { user: user._id } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      balance: user.balance,
      totalRecharges,
      totalSpent: totalSpent[0]?.total || 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};