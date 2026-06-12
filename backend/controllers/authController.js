const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');
const User = require('../models/User');

const signToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL || 'admin@crm.com';
  const password = process.env.ADMIN_PASSWORD || 'admin123';

  if (process.env.NODE_ENV === 'production' && (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD)) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD are required in production.');
  }

  const existing = await User.findOne({ email }).select('+password');

  if (existing) return existing;

  return User.create({
    name: 'Admin',
    email,
    password,
    role: 'admin',
  });
};

const login = async (req, res, next) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase();
    const password = String(req.body.password || '');

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    await ensureAdminUser();
    const user = await User.findOne({ email }).select('+password');
    const isMatch = user ? await user.comparePassword(password) : false;

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    return res.json({
      token: signToken(user),
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
