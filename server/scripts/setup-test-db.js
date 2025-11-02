#!/usr/bin/env node

/**
 * Setup script for test database
 * This script can be used to set up a test database with sample data
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/mern-testing';

async function setupTestDatabase() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // You can add setup logic here, such as creating indexes
    console.log('✅ Test database setup complete');

    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error setting up test database:', error);
    process.exit(1);
  }
}

setupTestDatabase();

