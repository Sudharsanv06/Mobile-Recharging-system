const Recharge = require('../models/Recharge');
const User = require('../models/User');
const Operator = require('../models/Operator');
const sendSMS = require('../utils/sendSMS');

// Create a new recharge
exports.createRecharge = async (req, res) => {
  try {
    const { operatorId, mobileNumber, planId, amount: bodyAmount, paymentMethod } = req.body;
    const userId = req.user.id;

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get operator if provided
    let operator = null;
    if (operatorId) {
      operator = await Operator.findById(operatorId);
      if (!operator) {
        return res.status(404).json({ success: false, message: 'Operator not found' });
      }
    }

    // Determine plan: prefer planId from operator, otherwise fall back to body amount
    let plan = null;
    let amount = null;
    if (planId && operator) {
      plan = operator.plans.id(planId);
      if (!plan) {
        return res.status(404).json({ success: false, message: 'Plan not found' });
      }
      amount = plan.amount;
    } else if (bodyAmount) {
      // Fallback plan object for amount-only requests
      amount = Number(bodyAmount);
      plan = {
        amount,
        validity: '',
        description: 'Custom top-up',
      };
    } else {
      return res.status(400).json({ success: false, message: 'Missing planId or amount' });
    }

    // Generate transaction ID
    const transactionId = `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`;

    // If paymentMethod is wallet, deduct balance immediately
    const pm = paymentMethod || 'wallet';
    if (pm === 'wallet') {
      // Check sufficient funds
      if (user.balance < amount) {
        return res.status(400).json({ success: false, message: 'Insufficient wallet balance' });
      }

      // Deduct and save user
      user.balance -= amount;
      await user.save();

      // Create recharge with wallet payment info
      const recharge = new Recharge({
        user: userId,
        operator: operatorId || null,
        mobileNumber,
        plan,
        amount,
        transactionId,
        status: 'success',
        paymentMethod: 'wallet',
        paymentStatus: 'completed',
      });

      await recharge.save();

      // Send confirmation SMS to user (best-effort)
      const userMessage = `Your recharge of ₹${amount} for ${mobileNumber} was successful. Transaction ID: ${transactionId}`;
      await sendSMS(user.phone, userMessage);

      // Send confirmation SMS to recharged number
      const rechargeMessage = `Your mobile number ${mobileNumber} has been recharged with ₹${amount}. Plan: ${plan.description || ''}. Transaction ID: ${transactionId}. Thank you for using Top It Up!`;
      await sendSMS(mobileNumber, rechargeMessage);

      return res.status(200).json({ success: true, data: recharge });
    }

    // For non-wallet payments, create recharge as pending and let payment gateway handle completion
    // Do not send SMS now — wait until payment is verified
    const recharge = new Recharge({
      user: userId,
      operator: operatorId || null,
      mobileNumber,
      plan,
      amount,
      transactionId,
      status: 'pending',
      paymentMethod: pm,
      paymentStatus: 'pending',
    });

    await recharge.save();

    return res.status(200).json({ success: true, data: recharge });
  } catch (err) {
    console.error('createRecharge error:', err);
    return res.status(500).json({ success: false, message: 'Server error' });
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