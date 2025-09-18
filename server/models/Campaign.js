// server/models/Campaign.js

const mongoose = require('mongoose');

const RewardSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    pledgeAmount: { type: Number, required: true },
    // You could add more fields like estimated delivery, items included, etc.
});

const CampaignSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // This creates a relationship to the User model
        required: true,
    },
    title: {
        type: String,
        required: [true, 'Please provide a title'],
    },
    story: {
        type: String,
        required: [true, 'Please tell your story'],
    },
    goalAmount: {
        type: Number,
        required: [true, 'Please specify your funding goal'],
    },
    amountRaised: {
        type: Number,
        default: 0,
    },
    endDate: {
        type: Date,
        required: [true, 'Please provide a campaign end date'],
    },
    imageUrl: {
        type: String,
        // This is the new, more reliable line
default: 'https://placehold.co/800x400/22c55e/ffffff?text=My+Campaign',
    },
    rewards: [RewardSchema] // An array of reward tiers
}, {
    timestamps: true
});

const Campaign = mongoose.model('Campaign', CampaignSchema);

module.exports = Campaign;