const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const createToken = (userId) => jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: '5h' });
const serializeUser = (user) => ({ _id: user._id, name: user.name, email: user.email });

const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required.' });
    const normalizedEmail = email.toLowerCase().trim();
    if (await User.findOne({ email: normalizedEmail })) return res.status(400).json({ message: 'User already exists.' });
    const user = await User.create({ name: name.trim(), email: normalizedEmail, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ token: createToken(user._id), user: serializeUser(user) });
  } catch (error) { console.error(error.message); res.status(500).json({ message: 'Server error.' }); }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email: email?.toLowerCase().trim() });
    if (!user || !(await bcrypt.compare(password || '', user.password))) return res.status(400).json({ message: 'Invalid credentials.' });
    res.json({ token: createToken(user._id), user: serializeUser(user) });
  } catch (error) { console.error(error.message); res.status(500).json({ message: 'Server error.' }); }
};

const getCurrentUser = async (req, res) => res.json({ user: serializeUser(req.user) });

module.exports = { registerUser, loginUser, getCurrentUser };
