const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  pledgeAmount: { type: Number, required: true, min: 1 },
});

const BackerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const CampaignSchema = new mongoose.Schema({
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: [true, 'Please provide a title'], trim: true },
  story: { type: String, required: [true, 'Please tell your story'] },
  goalAmount: { type: Number, required: [true, 'Please specify your funding goal'], min: 1 },
  amountRaised: { type: Number, default: 0, min: 0 },
  endDate: { type: Date, required: [true, 'Please provide a campaign end date'] },
  imageUrl: { type: String, default: 'https://placehold.co/800x400/22c55e/ffffff?text=My+Campaign' },
  rewards: { type: [RewardSchema], default: [] },
  backers: { type: [BackerSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model('Campaign', CampaignSchema);
