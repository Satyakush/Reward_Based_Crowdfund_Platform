const protect = require('./authMiddleware').protect;

const adminOnly = async (req, res, next) => {
  await protect(req, res, () => {
    const admins = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
    if (!admins.includes(String(req.user.email || '').toLowerCase())) {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    next();
  });
};

module.exports = { adminOnly };
