const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  type: { type: String, enum: ['payment_success', 'contribution_received', 'campaign_funded', 'campaign_ended', 'system'], default: 'system' },
  title: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', default: null },
  payment: { type: mongoose.Schema.Types.ObjectId, ref: 'Payment', default: null },
  readAt: { type: Date, default: null },
}, { timestamps: true });

notificationSchema.index({ user: 1, createdAt: -1 });
module.exports = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);
