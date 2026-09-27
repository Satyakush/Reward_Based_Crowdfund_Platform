const mongoose = require('mongoose');

const paymentEventSchema = new mongoose.Schema({
  eventId: { type: String, required: true, unique: true, index: true },
  event: { type: String, required: true, trim: true },
  status: { type: String, enum: ['pending', 'processed', 'failed'], default: 'pending', index: true },
  processedAt: { type: Date, default: null },
  error: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.models.PaymentEvent || mongoose.model('PaymentEvent', paymentEventSchema);
