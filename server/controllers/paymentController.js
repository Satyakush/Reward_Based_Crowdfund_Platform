const crypto = require('crypto');
const Campaign = require('../models/Campaign');
const Payment = require('../models/Payment');
const Notification = require('../models/Notification');
const getRazorpay = require('../config/razorpay');

const MAX_PAYMENT_AMOUNT = 1000000;
const CURRENCY = 'INR';

const createPaymentOrder = async (req, res) => {
  try {
    const campaign = await Campaign.findById(req.params.campaignId);
    if (!campaign) return res.status(404).json({ message: 'Campaign not found.' });

    const reward = campaign.rewards.id(req.body.rewardId);
    if (!reward) return res.status(400).json({ message: 'Invalid reward tier.' });

    if (campaign.creator.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot back your own campaign.' });
    }
    if (Number(campaign.amountRaised || 0) >= Number(campaign.goalAmount || 0)) return res.status(400).json({ message: 'This campaign is already fully funded.' });
    if (new Date(campaign.endDate).getTime() <= Date.now()) return res.status(400).json({ message: 'This campaign has ended.' });

    const remaining = Number(campaign.goalAmount) - Number(campaign.amountRaised || 0);
    const amount = Number(reward.pledgeAmount);
    if (remaining <= 0) return res.status(400).json({ message: 'This campaign is already fully funded.' });
    if (!Number.isFinite(amount) || amount <= 0 || amount > remaining) return res.status(400).json({ message: 'This reward amount exceeds the remaining campaign goal.' });
    if (amount > MAX_PAYMENT_AMOUNT) return res.status(400).json({ message: 'Payment amount exceeds the allowed limit.' });

    const razorpay = getRazorpay();
    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100),
      currency: CURRENCY,
      receipt: `campaign_${campaign._id}_${Date.now()}`,
      notes: { campaignId: campaign._id.toString(), backerId: req.user._id.toString(), rewardId: reward._id.toString() },
    });

    await Payment.create({
      campaign: campaign._id,
      backer: req.user._id,
      reward: reward._id,
      amount,
      currency: CURRENCY,
      razorpayOrderId: order.id,
    });

    res.status(201).json({
      keyId: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      campaignId: campaign._id,
      campaignTitle: campaign.title,
      reward: { _id: reward._id, title: reward.title, pledgeAmount: reward.pledgeAmount },
    });
  } catch (error) {
    console.error('Error creating payment order:', error.message);
    res.status(error.status || 500).json({ message: error.message || 'Unable to create payment order.' });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) return res.status(400).json({ message: 'Incomplete payment details.' });

    const paymentRecord = await Payment.findOne({ razorpayOrderId, backer: req.user._id });
    if (!paymentRecord) return res.status(404).json({ message: 'Payment order not found.' });
    if (paymentRecord.status === 'paid') return res.json({ message: 'Payment already verified.', payment: paymentRecord });

    const expected = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`).digest('hex');

    const a = Buffer.from(expected);
    const b = Buffer.from(razorpaySignature);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(400).json({ message: 'Payment verification failed.' });

    const razorpay = getRazorpay();
    const payment = await razorpay.payments.fetch(razorpayPaymentId);
    if (payment.order_id !== razorpayOrderId || payment.currency !== CURRENCY || payment.status !== 'captured') {
      return res.status(400).json({ message: 'Payment could not be confirmed as captured.' });
    }

    const updated = await finalizePayment(paymentRecord._id, payment.id, razorpaySignature, Number(payment.amount) / 100);
    if (!updated) return res.status(409).json({ message: 'Payment was already processed or campaign funding changed.' });

    res.json({ message: 'Payment completed successfully.', payment: updated });
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    res.status(500).json({ message: 'Unable to verify payment.' });
  }
};

const finalizePayment = async (paymentId, razorpayPaymentId, signature = null, capturedAmount) => {
  const paymentRecord = await Payment.findOneAndUpdate({ _id: paymentId, status: 'created' }, { $set: { status: 'processing' } }, { new: true });
  if (!paymentRecord) return null;
  if (capturedAmount !== Number(paymentRecord.amount)) {
    await Payment.findByIdAndUpdate(paymentId, { $set: { status: 'created' } });
    return null;
  }

  const campaign = await Campaign.findOneAndUpdate(
    { _id: paymentRecord.campaign, amountRaised: { $lte: Number.MAX_SAFE_INTEGER - capturedAmount }, $expr: { $lte: [{ $add: ['$amountRaised', capturedAmount] }, '$goalAmount'] } },
    { $inc: { amountRaised: capturedAmount }, $push: { backers: { user: paymentRecord.backer, amount: capturedAmount } } },
    { new: true }
  );
  if (!campaign) {
    await Payment.findByIdAndUpdate(paymentId, { $set: { status: 'created' } });
    return null;
  }

  paymentRecord.status = 'paid';
  paymentRecord.razorpayPaymentId = razorpayPaymentId;
  paymentRecord.razorpaySignature = signature;
  paymentRecord.paidAt = new Date();
  await paymentRecord.save();
  await Notification.create({ user: paymentRecord.backer, type: 'payment_success', title: 'Payment successful', message: `Your contribution to “${campaign.title}” was confirmed.`, campaign: campaign._id, payment: paymentRecord._id });
  if (Number(campaign.amountRaised) >= Number(campaign.goalAmount)) await Notification.create({ user: campaign.creator, type: 'campaign_funded', title: 'Campaign fully funded', message: `“${campaign.title}” has reached its funding goal.`, campaign: campaign._id, payment: paymentRecord._id });
  return paymentRecord;
};

module.exports = { createPaymentOrder, verifyPayment, finalizePayment };
