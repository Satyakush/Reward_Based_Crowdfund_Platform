const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return res.status(401).json({ message: 'Not authorized, no token.' });

  const token = authHeader.slice(7).trim();
  if (!token) return res.status(401).json({ message: 'Not authorized, no token.' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded?.user?.id;
    if (!userId) return res.status(401).json({ message: 'Not authorized, invalid token.' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(401).json({ message: 'Not authorized, user not found.' });

    req.user = user;
    next();
  } catch (error) {
    if (error.name !== 'JsonWebTokenError' && error.name !== 'TokenExpiredError') console.error('Authentication error:', error);
    return res.status(401).json({ message: 'Not authorized, token is invalid or expired.' });
  }
};

module.exports = { protect };
