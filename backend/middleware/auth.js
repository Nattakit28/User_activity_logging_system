const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Token is required'
    });
  }

  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not configured');

    return res.status(500).json({
      error: 'Server configuration error'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    if (!decoded.id) {
      return res.status(401).json({
        error: 'Invalid token payload'
      });
    }

    req.userId = decoded.id;
    next();

  } catch (error) {
    console.error('❌ AUTH ERROR:', error.message);

    return res.status(401).json({
      error: 'Invalid or expired token'
    });
  }
};

module.exports = verifyToken;