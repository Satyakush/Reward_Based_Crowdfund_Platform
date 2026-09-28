const Campaign = require('../models/Campaign');
const User = require('../models/User');
const Payment = require('../models/Payment');

const statusOf = (campaign) => {
  if (Number(campaign.amountRaised || 0) >= Number(campaign.goalAmount || 0)) return 'funded';
  if (new Date(campaign.endDate).getTime() <= Date.now()) return 'ended';
  return 'active';
};

const getAdminOverview = async (req, res, next) => {
  try {
    const [users, campaigns, payments] = await Promise.all([
      User.countDocuments(),
      Campaign.find().sort({ createdAt: -1 }).populate('creator', '_id name email'),
      Payment.find().sort({ createdAt: -1 }).limit(100).populate('campaign', '_id title').populate('backer', '_id name email'),
    ]);
    const paid = payments.filter(p => p.status === 'paid');
    res.json({
      users,
      campaigns: campaigns.map(c => ({ ...c.toObject(), status: statusOf(c) })),
      paymentSummary: {
        total: payments.length,
        paid: paid.length,
        failed: payments.filter(p => p.status === 'failed').length,
        processing: payments.filter(p => ['created', 'processing'].includes(p.status)).length,
        gross: paid.reduce((sum, p) => sum + Number(p.amount || 0), 0),
      },
      payments,
    });
  } catch (error) { next(error); }
};

module.exports = { getAdminOverview };
