const jwt = require('jsonwebtoken');
const User = require('../models/User');

const adminOnly = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized, no token.' });

  try {
    const decoded = jwt.verify(authHeader.slice(7).trim(), process.env.JWT_SECRET);
    const user = await User.findById(decoded?.user?.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized, user not found.' });

    const admins = (process.env.ADMIN_EMAILS || '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean);
    if (!admins.includes(String(user.email || '').toLowerCase())) return res.status(403).json({ message: 'Admin access required.' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Not authorized, token is invalid or expired.' });
  }
};

module.exports = { adminOnly };
