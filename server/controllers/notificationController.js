const Notification = require('../models/Notification');

const getNotifications = async (req, res, next) => {
  try {
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
