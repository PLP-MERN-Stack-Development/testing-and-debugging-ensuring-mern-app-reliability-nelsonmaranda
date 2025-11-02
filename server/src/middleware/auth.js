const { verifyToken } = require('../utils/auth');
const User = require('../models/User');
const logger = require('../utils/logger');

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 */
const authenticate = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Authentication required. Please provide a valid token.'
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = verifyToken(token);
    
    // Get user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({
        error: 'User not found. Token may be invalid.'
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    logger.error('Authentication error:', error.message);
    return res.status(401).json({
      error: 'Invalid or expired token. Please login again.'
    });
  }
};

/**
 * Authorization middleware
 * Checks if user has required role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Access denied. Insufficient permissions.'
      });
    }

    next();
  };
};

/**
 * Check if user owns the resource or is admin
 */
const checkOwnership = (resourceUserField = 'author') => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    // Admins can access any resource
    if (req.user.role === 'admin') {
      return next();
    }

    // Check if resource belongs to user
    // This assumes the resource has been fetched and attached to req.resource
    if (req.resource && req.resource[resourceUserField].toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: 'Access denied. You can only modify your own resources.'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize,
  checkOwnership
};

