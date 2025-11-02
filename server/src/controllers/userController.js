const User = require('../models/User');
const { generateToken } = require('../utils/auth');
const { asyncHandler } = require('../middleware/errorHandler');
const { isValidEmail, isValidPassword } = require('../utils/validators');
const logger = require('../utils/logger');

/**
 * Register a new user
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      error: 'Please provide username, email, and password'
    });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({
      error: 'Please provide a valid email address'
    });
  }

  if (!isValidPassword(password)) {
    return res.status(400).json({
      error: 'Password must be at least 6 characters long'
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      error: 'User with this email or username already exists'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password
  });

  // Generate token
  const token = generateToken(user);

  logger.info(`New user registered: ${user.username}`);

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  });
});

/**
 * Login user
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      error: 'Please provide email and password'
    });
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      error: 'Invalid email or password'
    });
  }

  // Check password
  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({
      error: 'Invalid email or password'
    });
  }

  // Generate token
  const token = generateToken(user);

  logger.info(`User logged in: ${user.username}`);

  res.json({
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role
    },
    token
  });
});

/**
 * Get current user profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);

  if (!user) {
    return res.status(404).json({
      error: 'User not found'
    });
  }

  res.json({
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }
  });
});

/**
 * Get all users (admin only)
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  
  res.json({
    count: users.length,
    users
  });
});

module.exports = {
  register,
  login,
  getProfile,
  getAllUsers
};

