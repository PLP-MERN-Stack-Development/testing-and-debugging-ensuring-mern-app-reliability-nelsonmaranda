const {
  isValidEmail,
  isValidPassword,
  isValidObjectId,
  sanitizeInput,
  validatePagination
} = require('../../src/utils/validators');
const mongoose = require('mongoose');

describe('Validator Utility Functions', () => {
  describe('isValidEmail', () => {
    it('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.com')).toBe(true);
    });

    it('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('@example.com')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('user @example.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    it('should return true for valid passwords (>= 6 characters)', () => {
      expect(isValidPassword('password123')).toBe(true);
      expect(isValidPassword('123456')).toBe(true);
      expect(isValidPassword('abcdef')).toBe(true);
      expect(isValidPassword('verylongpassword123')).toBe(true);
    });

    it('should return false for invalid passwords (< 6 characters)', () => {
      expect(isValidPassword('12345')).toBe(false);
      expect(isValidPassword('abc')).toBe(false);
      expect(isValidPassword('')).toBe(false);
      expect(isValidPassword(null)).toBe(false);
      expect(isValidPassword(undefined)).toBe(false);
    });
  });

  describe('isValidObjectId', () => {
    it('should return true for valid MongoDB ObjectIds', () => {
      const validId = new mongoose.Types.ObjectId();
      expect(isValidObjectId(validId.toString())).toBe(true);
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
    });

    it('should return false for invalid ObjectIds', () => {
      expect(isValidObjectId('invalid-id')).toBe(false);
      expect(isValidObjectId('123')).toBe(false);
      expect(isValidObjectId('')).toBe(false);
      expect(isValidObjectId(null)).toBe(false);
      expect(isValidObjectId(undefined)).toBe(false);
    });
  });

  describe('sanitizeInput', () => {
    it('should trim and remove HTML-like characters', () => {
      expect(sanitizeInput('  test  ')).toBe('test');
      expect(sanitizeInput('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeInput('normal text')).toBe('normal text');
    });

    it('should return non-string values unchanged', () => {
      expect(sanitizeInput(123)).toBe(123);
      expect(sanitizeInput(null)).toBe(null);
      expect(sanitizeInput({})).toEqual({});
    });
  });

  describe('validatePagination', () => {
    it('should return valid pagination for valid inputs', () => {
      const result = validatePagination(1, 10);
      
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.skip).toBe(0);
    });

    it('should default to page 1 and limit 10 for invalid inputs', () => {
      const result1 = validatePagination(null, null);
      expect(result1.page).toBe(1);
      expect(result1.limit).toBe(10);

      const result2 = validatePagination('invalid', 'invalid');
      expect(result2.page).toBe(1);
      expect(result2.limit).toBe(10);
    });

    it('should clamp page to minimum 1', () => {
      const result = validatePagination(0, 10);
      expect(result.page).toBe(1);
    });

    it('should clamp limit to between 1 and 100', () => {
      const result1 = validatePagination(1, 0);
      expect(result1.limit).toBe(1); // 0 should clamp to 1

      const result2 = validatePagination(1, 200);
      expect(result2.limit).toBe(100); // 200 should clamp to 100
      
      const result3 = validatePagination(1, -5);
      expect(result3.limit).toBe(1); // negative should clamp to 1
    });

    it('should calculate skip correctly', () => {
      const result1 = validatePagination(1, 10);
      expect(result1.skip).toBe(0);

      const result2 = validatePagination(2, 10);
      expect(result2.skip).toBe(10);

      const result3 = validatePagination(3, 20);
      expect(result3.skip).toBe(40);
    });
  });
});

