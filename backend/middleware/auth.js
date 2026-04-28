const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    console.warn('⚠️  AUTH FAILED: No token provided for', req.method, req.path);
    return res.status(401).json({ error: 'Token is required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    console.log(`✅ Token verified for user ID: ${decoded.id}`);
    next();
  } catch (error) {
    console.error('❌ AUTH ERROR:', error.message);
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = verifyToken;
