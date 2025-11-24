const crypto = require('crypto');
const Recharge = require('../models/Recharge');
const User = require('../models/User');
const logger = require('../utils/logger');
const { emitToUser, createAndEmitNotification } = require('../config/socket');
const sendSMS = require('../utils/sendSMS');

/**
 * Middleware to verify Razorpay webhook signature using raw request body
 */
exports.verifyWebhook = (req, res, next) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!webhookSecret) {
      logger.warn('Razorpay webhook secret not configured');
      return res.status(503).json({ success: false, message: 'Webhook not configured' });
    }

    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      logger.warn('Missing razorpay signature header');
      return res.status(400).json({ success: false, message: 'Missing signature' });
    }

    // Prefer rawBody (set by express.json verify). Fallback to stringified body
    const payload = req.rawBody || JSON.stringify(req.body || {});
    const expected = crypto.createHmac('sha256', webhookSecret).update(payload).digest('hex');

    if (expected !== signature) {
      logger.warn('Invalid webhook signature', { expected, signature });
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // signature verified
    next();
  } catch (err) {
    logger.error('Error verifying webhook signature', { error: err.message });
    res.status(500).json({ success: false, message: 'Webhook verification failed' });
  }
};

/**
 * Webhook handler: handles payment.captured and payment.failed events
 */
exports.webhookHandler = async (req, res) => {
  try {
    const event = req.body.event;
    const payment = req.body.payload?.payment?.entity;

    if (!event || !payment) {
      return res.status(400).json({ success: false, message: 'Invalid webhook payload' });
    }

    if (event === 'payment.captured') {
      const recharge = await Recharge.findOne({ razorpayPaymentId: payment.id });
      if (recharge) {
        recharge.paymentStatus = 'completed';
        recharge.status = 'success';
        recharge.razorpayOrderId = payment.order_id || recharge.razorpayOrderId;
        recharge.paymentMeta = { ...(recharge.paymentMeta || {}), webhookReceivedAt: new Date(), webhookEvent: event };
        await recharge.save();

        // Emit socket event
        try {
          emitToUser(recharge.user.toString(), 'recharge:status_changed', { id: recharge._id, status: recharge.status });
        } catch (emitErr) {
          logger.warn('Failed to emit socket event after webhook update', { error: emitErr.message });
        }

        // Send notifications (best-effort)
        try {
          const userObj = await User.findById(recharge.user);
          if (userObj && userObj.phone) {
            const userMessage = `Your payment of ₹${recharge.amount} for ${recharge.mobileNumber} was successful. Transaction ID: ${recharge.transactionId}`;
            await sendSMS(userObj.phone, userMessage);
          }

          const rechargeMessage = `Your mobile number ${recharge.mobileNumber} has been recharged with ₹${recharge.amount}. Transaction ID: ${recharge.transactionId}.`;
          await sendSMS(recharge.mobileNumber, rechargeMessage);

          // emit notification
          await createAndEmitNotification(recharge.user.toString(), {
            title: 'Payment Successful',
            body: `Your payment of ₹${recharge.amount} was successful.`,
            type: 'recharge',
            meta: { rechargeId: recharge._id },
          });
        } catch (notifyErr) {
          logger.warn('Failed to send notifications after webhook update', { error: notifyErr.message });
        }
      }
    } else if (event === 'payment.failed') {
      const recharge = await Recharge.findOne({ razorpayPaymentId: payment.id });
      if (recharge) {
        recharge.paymentStatus = 'failed';
        recharge.status = 'failed';
        recharge.paymentMeta = { ...(recharge.paymentMeta || {}), webhookReceivedAt: new Date(), webhookEvent: event };
        await recharge.save();

        try {
          emitToUser(recharge.user.toString(), 'recharge:status_changed', { id: recharge._id, status: recharge.status });
        } catch (emitErr) {
          logger.warn('Failed to emit socket event after webhook failed update', { error: emitErr.message });
        }
      }
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Error processing webhook', { error: error.message });
    res.status(500).json({ success: false, message: 'Webhook processing failed' });
  }
};
