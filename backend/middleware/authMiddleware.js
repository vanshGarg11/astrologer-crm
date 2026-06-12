const jwt = require('jsonwebtoken');
const { getJwtSecret } = require('../config/auth');
const User = require('../models/User');

const decodeToken = (req) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  try {
    return jwt.verify(token, getJwtSecret());
  } catch (err) {
    // swallow verification errors here; caller (protect) will handle undefined/invalid tokens
    return null;
  }
};

const protect = async (req, res, next) => {
  try {
    const decoded = decodeToken(req);
    if (!decoded) {
      return res.status(401).json({ message: 'Authentication token is required.' });
    }
    const user = await User.findById(decoded.id);

    if (!user || decoded.role !== 'admin') {
      return res.status(401).json({ message: 'User no longer exists.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = { protect };
