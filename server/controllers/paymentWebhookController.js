const crypto = require('crypto');
const Payment = require('../models/Payment');
const PaymentEvent = require('../models/PaymentEvent');
const { finalizePayment } = require('./paymentController');

const handleRazorpayWebhook = async (req, res) => {
  let paymentEvent = null;
  try {
    const signature = req.headers['x-razorpay-signature'];
    const eventId = req.headers['x-razorpay-event-id'];
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    if (!signature || !secret || !Buffer.isBuffer(req.body)) return res.status(400).json({ message: 'Invalid webhook request.' });

    const expected = crypto.createHmac('sha256', secret).update(req.body).digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(400).json({ message: 'Invalid webhook signature.' });

    const event = JSON.parse(req.body.toString('utf8'));

    if (eventId) {
      paymentEvent = await PaymentEvent.findOne({ eventId });
      if (paymentEvent?.status === 'processed') return res.json({ received: true, duplicate: true });
      if (!paymentEvent) {
        try {
          paymentEvent = await PaymentEvent.create({ eventId, event: event.event || 'unknown' });
        } catch (error) {
          if (error.code === 11000) paymentEvent = await PaymentEvent.findOne({ eventId });
          else throw error;
        }
      }
    }

    const entity = event.payload?.payment?.entity;
    if (event.event === 'payment.captured' && entity?.order_id) {
      const paymentRecord = await Payment.findOne({ razorpayOrderId: entity.order_id });
      if (paymentRecord && paymentRecord.status !== 'paid') {
        await finalizePayment(paymentRecord._id, entity.id, null, Number(entity.amount) / 100);
      }
    }

    if (event.event === 'payment.failed' && entity?.order_id) {
      await Payment.findOneAndUpdate(
        { razorpayOrderId: entity.order_id, status: { $ne: 'paid' } },
        { status: 'failed', failureReason: entity.error_description || entity.error_reason || 'Payment failed' }
      );
    }

    if (paymentEvent) {
      paymentEvent.status = 'processed';
      paymentEvent.processedAt = new Date();
      await paymentEvent.save();
    }

    res.json({ received: true });
  } catch (error) {
    if (paymentEvent) {
      try { paymentEvent.status = 'failed'; paymentEvent.error = error.message; await paymentEvent.save(); } catch {}
    }
    console.error('Razorpay webhook error:', error.message);
    res.status(500).json({ message: 'Webhook processing failed.' });
  }
};

module.exports = { handleRazorpayWebhook };
