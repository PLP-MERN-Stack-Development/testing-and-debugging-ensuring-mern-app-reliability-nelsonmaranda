/**
 * Validation utility functions
 */

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^\S+@\S+\.\S+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 */
const isValidPassword = (password) => {
  // At least 6 characters, must be truthy and have length
  return !!(password && typeof password === 'string' && password.length >= 6);
};

/**
 * Validate MongoDB ObjectId
 */
const isValidObjectId = (id) => {
  const ObjectId = require('mongoose').Types.ObjectId;
  return ObjectId.isValid(id);
};

/**
 * Sanitize string input
 */
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate pagination parameters
 */
const validatePagination = (page, limit) => {
  const pageNum = Math.max(1, parseInt(page) || 1);
  let limitNum = parseInt(limit);
  
  if (isNaN(limitNum)) {
    limitNum = 10; // default when invalid/not provided
  } else if (limitNum < 1) {
    limitNum = 1; // clamp to minimum 1 for explicit invalid values (0, negative)
  } else {
    limitNum = Math.min(100, limitNum); // clamp to maximum 100
  }
  
  return {
    page: pageNum,
    limit: limitNum,
    skip: (pageNum - 1) * limitNum
  };
};

module.exports = {
  isValidEmail,
  isValidPassword,
  isValidObjectId,
  sanitizeInput,
  validatePagination
};

