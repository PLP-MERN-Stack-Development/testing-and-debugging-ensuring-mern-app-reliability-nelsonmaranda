// users.test.js - Integration tests for users API endpoints

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');
const { generateToken } = require('../../src/utils/auth');

let mongoServer;
let adminToken;
let userToken;
let adminId;
let userId;

// Setup in-memory MongoDB server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  // Create an admin user
  const admin = await User.create({
    username: 'admin',
    email: 'admin@example.com',
    password: 'password123',
    role: 'admin'
  });
  adminId = admin._id;
  adminToken = generateToken(admin);

  // Create a regular user
  const user = await User.create({
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    role: 'user'
  });
  userId = user._id;
  userToken = generateToken(user);
});

// Clean up after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

// Clean up database between tests
afterEach(async () => {
  // Keep test users, but clean up any other created data
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    if (collections[key].collectionName === 'users') {
      // Keep admin and testuser
      await collections[key].deleteMany({
        _id: { $nin: [adminId, userId] }
      });
    }
  }
});

describe('POST /api/users/register', () => {
  it('should register a new user', async () => {
    const newUser = {
      username: 'newuser',
      email: 'newuser@example.com',
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(newUser);

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('user');
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.username).toBe(newUser.username);
    expect(res.body.user.email).toBe(newUser.email);
    expect(res.body.user.password).toBeUndefined();
  });

  it('should return 400 if email already exists', async () => {
    const duplicateUser = {
      username: 'duplicate',
      email: 'test@example.com', // Already exists
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(duplicateUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if validation fails', async () => {
    const invalidUser = {
      username: 'ab', // Too short
      email: 'invalid-email', // Invalid format
      password: '123' // Too short
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(invalidUser);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteUser = {
      username: 'incomplete'
      // Missing email and password
    };

    const res = await request(app)
      .post('/api/users/register')
      .send(incompleteUser);

    expect(res.status).toBe(400);
  });
});

describe('POST /api/users/login', () => {
  it('should login with valid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/users/login')
      .send(credentials);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.email).toBe(credentials.email);
  });

  it('should return 401 with invalid email', async () => {
    const credentials = {
      email: 'wrong@example.com',
      password: 'password123'
    };

    const res = await request(app)
      .post('/api/users/login')
      .send(credentials);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 with invalid password', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const res = await request(app)
      .post('/api/users/login')
      .send(credentials);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 if email or password is missing', async () => {
    const incompleteCredentials = {
      email: 'test@example.com'
      // Missing password
    };

    const res = await request(app)
      .post('/api/users/login')
      .send(incompleteCredentials);

    expect(res.status).toBe(400);
  });
});

describe('GET /api/users/profile', () => {
  it('should return user profile when authenticated', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user._id || res.body.user.id).toBeDefined();
    expect(res.body.user.username).toBe('testuser');
    expect(res.body.user.password).toBeUndefined();
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/users/profile');

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 with invalid token', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', 'Bearer invalid.token.here');

    expect(res.status).toBe(401);
  });
});

describe('GET /api/users/users', () => {
  it('should return all users for admin', async () => {
    const res = await request(app)
      .get('/api/users/users')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('users');
    expect(Array.isArray(res.body.users)).toBeTruthy();
    expect(res.body.users.length).toBeGreaterThan(0);
  });

  it('should return 403 for non-admin users', async () => {
    const res = await request(app)
      .get('/api/users/users')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 401 if not authenticated', async () => {
    const res = await request(app)
      .get('/api/users/users');

    expect(res.status).toBe(401);
  });
});

