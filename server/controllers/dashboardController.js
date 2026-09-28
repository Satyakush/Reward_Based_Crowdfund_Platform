const Campaign = require('../models/Campaign');
const Payment = require('../models/Payment');

const statusOf = (campaign) => {
  if (Number(campaign.amountRaised || 0) >= Number(campaign.goalAmount || 0)) return 'funded';
  if (new Date(campaign.endDate).getTime() <= Date.now()) return 'ended';
  return 'active';
};

const getDashboard = async (req, res, next) => {
  try {
    const [campaigns, payments] = await Promise.all([
      Campaign.find({ creator: req.user._id }).sort({ createdAt: -1 }).populate('creator', '_id name'),
      Payment.find({ backer: req.user._id }).sort({ createdAt: -1 }).limit(30).populate('campaign', '_id title imageUrl rewards endDate goalAmount amountRaised creator'),
    ]);

    const creator = campaigns.reduce((acc, campaign) => {
      const raised = Number(campaign.amountRaised || 0);
      const goal = Number(campaign.goalAmount || 0);
      acc.campaigns += 1;
      acc.raised += raised;
      acc.goal += goal;
      acc.backers += campaign.backers?.length || 0;
      acc.active += statusOf(campaign) === 'active' ? 1 : 0;
      acc.funded += statusOf(campaign) === 'funded' ? 1 : 0;
      acc.ended += statusOf(campaign) === 'ended' ? 1 : 0;
      return acc;
    }, { campaigns: 0, raised: 0, goal: 0, backers: 0, active: 0, funded: 0, ended: 0 });

    const paidPayments = payments.filter(p => p.status === 'paid');
    const paymentHistory = payments.map((payment) => {
      const campaign = payment.campaign;
      const reward = campaign?.rewards?.id(payment.reward);
      return {
        ...payment.toObject(),
        reward: reward ? { _id: reward._id, title: reward.title, pledgeAmount: reward.pledgeAmount } : null,
        campaignStatus: campaign ? statusOf(campaign) : null,
      };
    });

    const backer = {
      contributions: paidPayments.length,
      total: paidPayments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
      pending: payments.filter(p => ['created', 'processing'].includes(p.status)).length,
      failed: payments.filter(p => p.status === 'failed').length,
    };

    const rewardStats = {};
    paidPayments.forEach((payment) => {
      const reward = payment.campaign?.rewards?.id(payment.reward);
      if (!reward) return;
      const key = String(reward._id);
      rewardStats[key] ||= { title: reward.title, pledgeAmount: reward.pledgeAmount, contributions: 0, raised: 0 };
      rewardStats[key].contributions += 1;
      rewardStats[key].raised += Number(payment.amount || 0);
    });

    const analytics = {
      averageContribution: paidPayments.length ? Math.round(backer.total / paidPayments.length) : 0,
      rewardPerformance: Object.values(rewardStats).sort((a, b) => b.raised - a.raised),
      campaignPerformance: campaigns.map(c => ({
        _id: c._id, title: c.title, status: statusOf(c), goalAmount: c.goalAmount,
        amountRaised: c.amountRaised, backers: c.backers?.length || 0,
        fundingPercent: c.goalAmount ? Math.min(100, Math.round((c.amountRaised / c.goalAmount) * 100)) : 0,
        endDate: c.endDate, createdAt: c.createdAt,
      })),
    };

    res.json({ creator, backer, campaigns: campaigns.map(c => ({ ...c.toObject(), status: statusOf(c) })), payments: paymentHistory, analytics });
  } catch (error) { next(error); }
};

module.exports = { getDashboard };