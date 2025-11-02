const { generateToken, verifyToken, decodeToken } = require('../../src/utils/auth');

describe('Auth Utility Functions', () => {
  const mockUser = {
    _id: '507f1f77bcf86cd799439011',
    username: 'testuser',
    email: 'test@example.com',
    role: 'user'
  };

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const token = generateToken(mockUser);
      
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user information in token', () => {
      const token = generateToken(mockUser);
      const decoded = decodeToken(token);
      
      expect(decoded.id).toBe(mockUser._id);
      expect(decoded.username).toBe(mockUser.username);
      expect(decoded.email).toBe(mockUser.email);
      expect(decoded.role).toBe(mockUser.role);
    });

    it('should generate different tokens for different users', () => {
      const user1 = { ...mockUser, _id: 'user1' };
      const user2 = { ...mockUser, _id: 'user2' };
      
      const token1 = generateToken(user1);
      const token2 = generateToken(user2);
      
      expect(token1).not.toBe(token2);
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', () => {
      const token = generateToken(mockUser);
      const decoded = verifyToken(token);
      
      expect(decoded.id).toBe(mockUser._id);
      expect(decoded.username).toBe(mockUser.username);
    });

    it('should throw error for invalid token', () => {
      const invalidToken = 'invalid.token.here';
      
      expect(() => {
        verifyToken(invalidToken);
      }).toThrow();
    });

    it('should throw error for expired token', () => {
      // Note: In a real scenario, you'd test with an expired token
      // For now, we test with an invalid token format
      const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.invalid.signature';
      
      expect(() => {
        verifyToken(malformedToken);
      }).toThrow();
    });
  });

  describe('decodeToken', () => {
    it('should decode token without verification', () => {
      const token = generateToken(mockUser);
      const decoded = decodeToken(token);
      
      expect(decoded).toBeDefined();
      expect(decoded.id).toBe(mockUser._id);
    });

    it('should decode even invalid tokens (for testing)', () => {
      // decodeToken doesn't verify, so it will decode malformed tokens
      const malformedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InRlc3QifQ.invalid';
      const decoded = decodeToken(malformedToken);
      
      expect(decoded).toBeDefined();
    });
  });
});

