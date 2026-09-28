const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true, index: true },
  backer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  reward: { type: mongoose.Schema.Types.ObjectId, required: false },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: 'INR', uppercase: true, trim: true },
  status: { type: String, enum: ['created', 'processing', 'paid', 'failed'], default: 'created', index: true },
  razorpayOrderId: { type: String, required: true, unique: true, index: true },
  razorpayPaymentId: { type: String, default: undefined, unique: true, sparse: true, index: true },
  razorpaySignature: { type: String, default: null },
  failureReason: { type: String, default: '' },
  paidAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.models.Payment || mongoose.model('Payment', paymentSchema);
