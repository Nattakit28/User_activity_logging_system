const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');
const verifyToken = require('../middleware/auth');

// Register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: 'All fields are required'
      });
    }

    const existingUser = await User.findOne({
      $or: [
        { username },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(400).json({
        error: 'Username or email already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      message: 'User registered successfully',
      userId: user._id.toString()
    });

  } catch (error) {
    console.error('Registration error:', error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        error: 'Username or email already exists'
      });
    }

    res.status(500).json({
      error: 'Registration failed'
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        error: 'Username and password are required'
      });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Invalid username or password'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(
      {
        id: user._id.toString(),
        username: user.username
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);

    res.status(500).json({
      error: 'Login failed'
    });
  }
});

// Profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .select('-password');

    if (!user) {
      return res.status(404).json({
        error: 'User not found'
      });
    }

    res.json({
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      created_at: user.created_at
    });

  } catch (error) {
    console.error('Profile error:', error.message);

    res.status(500).json({
      error: 'Database error'
    });
  }
});

module.exports = router;