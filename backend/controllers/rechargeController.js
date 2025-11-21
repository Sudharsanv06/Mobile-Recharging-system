const Recharge = require('../models/Recharge');
const User = require('../models/User');
const Operator = require('../models/Operator');
const sendSMS = require('../utils/sendSMS');

// Create a new recharge
exports.createRecharge = async (req, res) => {
  try {
    const { operatorId, mobileNumber, planId } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Get operator and plan
    const operator = await Operator.findById(operatorId);
    if (!operator) {
      return res.status(404).json({ msg: 'Operator not found' });
    }

    const plan = operator.plans.id(planId);
    if (!plan) {
      return res.status(404).json({ msg: 'Plan not found' });
    }

    // Check user balance
    // if (user.balance < plan.amount) {
    //   return res.status(400).json({ msg: 'Insufficient balance' });
    // }

    // Deduct amount from user balance
    // user.balance -= plan.amount;
    // await user.save();

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // Create recharge
    const recharge = new Recharge({
      user: userId,
      operator: operatorId,
      mobileNumber,
      plan,
      amount: plan.amount,
      transactionId,
      status: 'success',
    });

    await recharge.save();

    // Send confirmation SMS to user
    const userMessage = `Your recharge of ₹${plan.amount} for ${mobileNumber} was successful. Transaction ID: ${transactionId}`;
    await sendSMS(user.phone, userMessage);

    // Send confirmation SMS to recharged number
    const rechargeMessage = `Your mobile number ${mobileNumber} has been recharged with ₹${plan.amount}. Plan: ${plan.description}. Transaction ID: ${transactionId}. Thank you for using Top It Up!`;
    await sendSMS(mobileNumber, rechargeMessage);

    res.json(recharge);
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

// Get recharge by ID
exports.getRechargeById = async (req, res) => {
  try {
    const recharge = await Recharge.findById(req.params.id)
      .populate('user', 'name phone')
      .populate('operator', 'name logo');

    if (!recharge) {
      return res.status(404).json({ msg: 'Recharge not found' });
    }

    // Check if the user is authorized to view this recharge
    if (recharge.user._id.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }

    res.json(recharge);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Recharge not found' });
    }
    res.status(500).send('Server error');
  }
};