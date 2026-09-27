const Campaign = require('../models/Campaign');
const Payment = require('../models/Payment');

const getDashboard = async (req, res, next) => {
  try {
    const [campaigns, payments] = await Promise.all([
      Campaign.find({ creator: req.user._id }).sort({ createdAt: -1 }).populate('creator', '_id name'),
      Payment.find({ backer: req.user._id, status: 'paid' }).sort({ paidAt: -1 }).populate('campaign', '_id title imageUrl'),
    ]);

    const creator = campaigns.reduce((acc, campaign) => {
      acc.campaigns += 1;
      acc.raised += Number(campaign.amountRaised || 0);
      acc.goal += Number(campaign.goalAmount || 0);
      acc.backers += campaign.backers?.length || 0;
      return acc;
    }, { campaigns: 0, raised: 0, goal: 0, backers: 0 });

    const paymentHistory = payments.map((payment) => {
      const campaign = payment.campaign;
      const reward = campaign && campaign.rewards ? campaign.rewards.id(payment.reward) : null;
      return { ...payment.toObject(), reward: reward ? { _id: reward._id, title: reward.title, pledgeAmount: reward.pledgeAmount } : null };
    });
    const backer = { contributions: payments.length, total: payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0) };

    res.json({ creator, backer, campaigns, payments: paymentHistory });
  } catch (error) { next(error); }
};

module.exports = { getDashboard };
