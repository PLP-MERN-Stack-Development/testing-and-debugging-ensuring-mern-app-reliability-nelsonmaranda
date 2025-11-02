const { authenticate, authorize, checkOwnership } = require('../../src/middleware/auth');
const { generateToken } = require('../../src/utils/auth');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const User = require('../../src/models/User');

// This test file should not use the global setup.js
// We'll manage MongoDB setup manually only for the test that needs it
describe('Auth Middleware', () => {
  let req, res, next;
  let mongoServer;

  afterAll(async () => {
    if (mongoServer) {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoServer.stop();
    }
  }, 30000);

  beforeEach(() => {
    req = {
      headers: {},
      user: null
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    next = jest.fn();
  });

  describe('authenticate', () => {
    it('should return 401 if no authorization header', async () => {
      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Authentication required. Please provide a valid token.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if token format is invalid', async () => {
      req.headers.authorization = 'InvalidFormat token123';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });

    it('should authenticate valid token and attach user to request', async () => {
      // Set up MongoDB for this test
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        await mongoose.connect(mongoUri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
      }

      // Create a test user
      const user = await User.create({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
      });

      const token = generateToken(user);
      req.headers.authorization = `Bearer ${token}`;

      await authenticate(req, res, next);

      expect(req.user).toBeDefined();
      expect(req.user._id.toString()).toBe(user._id.toString());
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    }, 60000); // Increase timeout for this test

    it('should return 401 for invalid token', async () => {
      req.headers.authorization = 'Bearer invalid.token.here';

      await authenticate(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('authorize', () => {
    it('should allow access for authorized role', () => {
      req.user = { role: 'admin' };
      const middleware = authorize('admin', 'user');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access for unauthorized role', () => {
      req.user = { role: 'user' };
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Access denied. Insufficient permissions.'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 if user is not authenticated', () => {
      req.user = null;
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('checkOwnership', () => {
    it('should allow access for admin users', () => {
      req.user = { _id: 'user1', role: 'admin' };
      req.resource = { author: 'user2' };
      const middleware = checkOwnership();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should allow access if user owns the resource', () => {
      req.user = { _id: 'user1', role: 'user' };
      req.resource = { author: 'user1' };
      const middleware = checkOwnership();

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
    });

    it('should deny access if user does not own the resource', () => {
      req.user = { _id: 'user1', role: 'user' };
      req.resource = { author: 'user2' };
      const middleware = checkOwnership();

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});

