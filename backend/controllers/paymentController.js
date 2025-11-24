const Razorpay = require('razorpay');
const crypto = require('crypto');
const Recharge = require('../models/Recharge');
const User = require('../models/User');
const logger = require('../utils/logger');
const { emitToUser, createAndEmitNotification } = require('../config/socket');

// Initialize Razorpay
let razorpayInstance = null;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
}

/**
 * Create Razorpay order
 */
exports.createOrder = async (req, res) => {
  try {
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment gateway not configured',
      });
    }

    const { amount, currency = 'INR', rechargeId } = req.body;

    if (!amount || amount < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount',
      });
    }

    // Verify recharge exists and belongs to user
    if (rechargeId) {
      const recharge = await Recharge.findOne({
        _id: rechargeId,
        user: req.user.id,
      });

      if (!recharge) {
        return res.status(404).json({
          success: false,
          message: 'Recharge not found',
        });
      }
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `recharge_${Date.now()}`,
      notes: {
        userId: req.user.id.toString(),
        rechargeId: rechargeId || 'new',
      },
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      data: {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      },
    });
  } catch (error) {
    logger.error('Error creating Razorpay order', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
    });
  }
};

/**
 * Verify Razorpay payment and update recharge
 */
exports.verifyPayment = async (req, res) => {
  try {
    const { orderId, paymentId, signature, rechargeId } = req.body;

    if (!orderId || !paymentId || !signature) {
      return res.status(400).json({
        success: false,
        message: 'Missing payment details',
      });
    }

    // Verify signature
    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${orderId}|${paymentId}`)
      .digest('hex');

    if (generatedSignature !== signature) {
      logger.warn('Invalid payment signature', { orderId, paymentId });
      return res.status(400).json({
        success: false,
        message: 'Invalid payment signature',
      });
    }

    // Find and update recharge
    const recharge = await Recharge.findOne({
      _id: rechargeId,
      user: req.user.id,
    });

    if (!recharge) {
      return res.status(404).json({
        success: false,
        message: 'Recharge not found',
      });
    }

    // Update recharge with payment details
    recharge.paymentMethod = 'razorpay';
    recharge.paymentStatus = 'completed';
    recharge.status = 'success';
    recharge.razorpayOrderId = orderId;
    recharge.razorpayPaymentId = paymentId;
    recharge.razorpaySignature = signature;
    recharge.paymentMeta = {
      verifiedAt: new Date(),
    };

    await recharge.save();

    // Emit real-time event
    emitToUser(recharge.user.toString(), 'recharge:status_changed', {
      rechargeId: recharge._id,
      status: recharge.status,
      amount: recharge.amount,
      transactionId: recharge.transactionId,
    });

    // Create notification
    await createAndEmitNotification(recharge.user.toString(), {
      title: 'Payment Successful',
      body: `Your payment of ₹${recharge.amount} was successful. Recharge completed.`,
      type: 'recharge',
      meta: { rechargeId: recharge._id, transactionId: recharge.transactionId },
    });

    res.json({
      success: true,
      message: 'Payment verified successfully',
      data: recharge,
    });
  } catch (error) {
    logger.error('Error verifying payment', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
    });
  }
};

/**
 * Webhook handler for Razorpay
 */
exports.webhook = async (req, res) => {
  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.warn('Razorpay webhook secret not configured');
      return res.status(503).json({
        success: false,
        message: 'Webhook not configured',
      });
    }

    // Verify webhook signature
    const crypto = require('crypto');
    const generatedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(JSON.stringify(req.body))
      .digest('hex');

    if (generatedSignature !== webhookSignature) {
      logger.warn('Invalid webhook signature');
      return res.status(400).json({
        success: false,
        message: 'Invalid signature',
      });
    }

    const event = req.body.event;
    const payment = req.body.payload.payment?.entity;

    if (event === 'payment.captured' && payment) {
      // Find recharge by razorpay payment ID
      const recharge = await Recharge.findOne({
        razorpayPaymentId: payment.id,
      });

      if (recharge) {
        recharge.paymentStatus = 'completed';
        recharge.status = 'success';
        recharge.paymentMeta = {
          ...recharge.paymentMeta,
          webhookReceivedAt: new Date(),
          webhookEvent: event,
        };
        await recharge.save();

        logger.info('Recharge updated via webhook', {
          rechargeId: recharge._id,
          paymentId: payment.id,
        });
      }
    } else if (event === 'payment.failed' && payment) {
      const recharge = await Recharge.findOne({
        razorpayPaymentId: payment.id,
      });

      if (recharge) {
        recharge.paymentStatus = 'failed';
        recharge.status = 'failed';
        recharge.paymentMeta = {
          ...recharge.paymentMeta,
          webhookReceivedAt: new Date(),
          webhookEvent: event,
        };
        await recharge.save();
      }
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing webhook', { error: error.message });
    res.status(500).json({
      success: false,
      message: 'Webhook processing failed',
    });
  }
};

