// Setup file for server-side tests
// This setup is only used for tests that explicitly need MongoDB
// Tests that don't need MongoDB should manage their own setup
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;
let isSetup = false;

// Only set up MongoDB if not already connected and if test needs it
const setupMongoDB = async () => {
  if (isSetup || mongoose.connection.readyState === 1) {
    return;
  }

  try {
    // Increase timeout for MongoDB Memory Server initialization
    jest.setTimeout(60000); // 60 seconds
    
    // Create in-memory MongoDB instance
    mongoServer = await MongoMemoryServer.create({
      binary: {
        version: '6.0.14',
      },
      instance: {
        dbName: 'test-db',
      },
    });
    const mongoUri = mongoServer.getUri();
    
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    isSetup = true;
  } catch (error) {
    console.warn('MongoDB setup skipped or failed:', error.message);
  }
};

// Make setupMongoDB available to tests that need it
global.setupMongoDB = setupMongoDB;

// Only run setup if we detect tests that need MongoDB (have models)
// Skip for authMiddleware - it handles its own MongoDB setup
beforeAll(async () => {
  // Check if test file imports models
  const testPath = expect.getState().testPath;
  if (testPath && (
    testPath.includes('integration') || 
    testPath.includes('models')
    // Note: authMiddleware handles its own MongoDB setup, so skip it here
  )) {
    await setupMongoDB();
  }
}, 60000); // 60 second timeout for beforeAll

afterAll(async () => {
  // Clean up
  if (mongoServer && isSetup) {
    try {
      if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
      }
      await mongoServer.stop();
      isSetup = false;
    } catch (error) {
      console.warn('MongoDB cleanup error:', error.message);
    }
  }
}, 30000); // 30 second timeout for afterAll

afterEach(async () => {
  // Clean up collections after each test
  if (isSetup && mongoose.connection.readyState !== 0) {
    try {
      const collections = mongoose.connection.collections;
      for (const key in collections) {
        await collections[key].deleteMany({});
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  }
});

