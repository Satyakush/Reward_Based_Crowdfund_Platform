const Notification = require('../models/Notification');
const Campaign = require('../models/Campaign');

const getNotifications = async (req, res, next) => {
  try {
    const ended = await Campaign.find({ creator: req.user._id, endDate: { $lte: new Date() } }).select('_id title');
    if (ended.length) {
      const existing = await Notification.find({ user: req.user._id, type: 'campaign_ended', campaign: { $in: ended.map(c => c._id) } }).select('campaign');
      const seen = new Set(existing.map(item => String(item.campaign)));
      const missing = ended.filter(c => !seen.has(String(c._id)));
      if (missing.length) {
        await Notification.insertMany(missing.map(c => ({
          user: req.user._id, type: 'campaign_ended', title: 'Campaign ended',
          message: `“${c.title}” has reached its end date.`, campaign: c._id
        })), { ordered: false });
      }
    }

    const notifications = await Notification.find({ user: req.user._id })
      .populate('campaign', '_id title')
      .sort({ createdAt: -1 })
      .limit(50);
    const unreadCount = await Notification.countDocuments({ user: req.user._id, readAt: null });
    res.json({ notifications, unreadCount });
  } catch (error) { next(error); }
};

const markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ user: req.user._id, readAt: null }, { $set: { readAt: new Date() } });
    res.json({ message: 'Notifications marked as read.' });
  } catch (error) { next(error); }
};

const markRead = async (req, res, next) => {
  try {
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: { readAt: new Date() } },
      { new: true }
    );
    if (!notification) return res.status(404).json({ message: 'Notification not found.' });
    res.json(notification);
  } catch (error) { next(error); }
};

module.exports = { getNotifications, markAllRead, markRead };
