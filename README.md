# Testing and Debugging MERN Applications

This assignment focuses on implementing comprehensive testing strategies for a MERN stack application, including unit testing, integration testing, and end-to-end testing, along with debugging techniques.

## Assignment Overview

You will:
1. Set up testing environments for both client and server
2. Write unit tests for React components and server functions
3. Implement integration tests for API endpoints
4. Create end-to-end tests for critical user flows
5. Apply debugging techniques for common MERN stack issues

## Project Structure

```
mern-testing/
├── client/                 # React front-end
│   ├── src/                # React source code
│   │   ├── components/     # React components
│   │   │   ├── Button.jsx  # Reusable button component
│   │   │   ├── ErrorBoundary.jsx  # Error boundary for error handling
│   │   │   └── PostCard.jsx  # Post display component
│   │   ├── hooks/          # Custom React hooks
│   │   │   └── usePosts.js  # Posts management hook
│   │   ├── utils/          # Utility functions
│   │   │   └── api.js      # API configuration
│   │   ├── tests/          # Client-side tests
│   │   │   ├── unit/       # Unit tests
│   │   │   └── integration/ # Integration tests
│   │   ├── App.jsx         # Main application component
│   │   └── index.js        # Application entry point
│   └── package.json        # Client dependencies
├── server/                 # Express.js back-end
│   ├── src/                # Server source code
│   │   ├── controllers/    # Route controllers
│   │   │   ├── userController.js
│   │   │   └── postController.js
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.js
│   │   │   ├── Post.js
│   │   │   └── Category.js
│   │   ├── routes/         # API routes
│   │   │   ├── userRoutes.js
│   │   │   └── postRoutes.js
│   │   ├── middleware/     # Custom middleware
│   │   │   ├── auth.js      # Authentication middleware
│   │   │   └── errorHandler.js  # Global error handler
│   │   ├── utils/          # Utility functions
│   │   │   ├── auth.js     # JWT utilities
│   │   │   ├── logger.js   # Logging utilities
│   │   │   └── validators.js  # Validation utilities
│   │   ├── app.js          # Express app configuration
│   │   └── server.js       # Server entry point
│   ├── tests/              # Server-side tests
│   │   ├── unit/           # Unit tests
│   │   │   ├── auth.test.js
│   │   │   ├── logger.test.js
│   │   │   ├── validators.test.js
│   │   │   └── authMiddleware.test.js
│   │   └── integration/    # Integration tests
│   │       ├── posts.test.js
│   │       └── users.test.js
│   └── package.json        # Server dependencies
├── cypress/                # End-to-end tests
│   ├── e2e/               # E2E test files
│   │   ├── auth.cy.js
│   │   └── posts.cy.js
│   └── support/           # Cypress support files
├── jest.config.js          # Jest configuration
├── cypress.config.js       # Cypress configuration
└── package.json            # Root dependencies
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local installation or Atlas account)
- npm or yarn
- Basic understanding of testing concepts

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd "Week 6"
   ```

2. Install all dependencies:
   ```bash
   npm run install-all
   ```

3. Set up environment variables:
   
   Create a `.env` file in the `server` directory:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/mern-testing
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRE=7d
   ```

   Create a `.env` file in the `client` directory:
   ```env
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Set up the test database:
   ```bash
   npm run setup-test-db
   ```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Specific Test Suites
```bash
# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration

# End-to-end tests
npm run test:e2e

# Open Cypress UI
npm run test:e2e:open
```

### Run Tests for Specific Projects
```bash
# Client tests only
npm run test:client

# Server tests only
npm run test:server

# Watch mode
npm run test:watch
```

## Testing Strategy

### 1. Unit Testing

Unit tests focus on testing individual functions and components in isolation.

#### Server-Side Unit Tests

- **auth.test.js**: Tests JWT token generation, verification, and decoding
- **logger.test.js**: Tests logging utilities for different log levels
- **validators.test.js**: Tests validation functions for email, password, ObjectId, etc.
- **authMiddleware.test.js**: Tests authentication and authorization middleware

#### Client-Side Unit Tests

- **Button.test.jsx**: Tests button component variants, sizes, and interactions
- **PostCard.test.jsx**: Tests post card rendering and data display
- **ErrorBoundary.test.jsx**: Tests error boundary error handling

### 2. Integration Testing

Integration tests verify that different parts of the application work together correctly.

#### Server Integration Tests

- **posts.test.js**: Tests complete CRUD operations for posts API
  - Creating posts with authentication
  - Reading posts (with pagination and filtering)
  - Updating posts (with ownership checks)
  - Deleting posts (with authorization)

- **users.test.js**: Tests user authentication and authorization flows
  - User registration with validation
  - User login with credential verification
  - Protected routes requiring authentication
  - Admin-only routes requiring authorization

#### Client Integration Tests

- **PostCard.integration.test.jsx**: Tests component interactions with API calls

### 3. End-to-End Testing

E2E tests verify complete user workflows from start to finish.

- **auth.cy.js**: Tests authentication flows
- **posts.cy.js**: Tests complete post CRUD operations through the API

## Code Coverage

The project is configured to achieve at least **70% code coverage** for:
- Statements: 70%
- Branches: 60%
- Functions: 70%
- Lines: 70%

### Current Coverage Results

The project **exceeds all coverage thresholds**:

- **Statements**: 88.28% (294/333) ✅ **EXCEEDS 70%**
- **Branches**: 77.34% (140/181) ✅ **EXCEEDS 60%**
- **Functions**: 88.67% (47/53) ✅ **EXCEEDS 70%**
- **Lines**: 89.50% (290/324) ✅ **EXCEEDS 70%**

### Coverage Breakdown

#### Overall Coverage Summary

![Coverage Overview](screenshots/coverage-overview.png)

**Coverage by Module:**
- **Client Components**: 96.29% coverage
  - Button.jsx: 100%
  - PostCard.jsx: 100%
  - ErrorBoundary.jsx: 92.3%
- **Server Utils**: 100% coverage
- **Server Routes**: 100% coverage
- **Server Models**: 93.10% coverage
- **Server Controllers**: 81.89% coverage
- **Server Middleware**: 81.35% coverage

#### Client-Side Coverage

![Client Coverage](screenshots/coverage-client.png)

Client components show excellent coverage with 96.29% overall.

#### Server-Side Coverage

![Server Coverage](screenshots/coverage-server.png)

Server modules demonstrate strong coverage across all layers.

To view coverage reports:
```bash
npm test -- --coverage
```

Coverage reports are generated in:
- `coverage/server/` - Server-side coverage
- `coverage/client/` - Client-side coverage
- `coverage/lcov-report/` - Detailed LCOV report (recommended)

## Debugging Techniques

### 1. Server-Side Debugging

#### Logging Strategy
- **Logger Utility** (`server/src/utils/logger.js`):
  - `error()`: Logs errors with red color
  - `warn()`: Logs warnings with yellow color
  - `info()`: Logs informational messages with cyan color
  - `debug()`: Logs debug messages only in development mode

#### Global Error Handler
- **Error Handler Middleware** (`server/src/middleware/errorHandler.js`):
  - Catches all unhandled errors
  - Provides meaningful error messages
  - Handles Mongoose validation errors
  - Handles JWT authentication errors
  - Returns appropriate HTTP status codes

#### Async Error Handling
- Uses `asyncHandler` wrapper to catch errors in async route handlers
- Prevents unhandled promise rejections

### 2. Client-Side Debugging

#### Error Boundary
- **ErrorBoundary Component** (`client/src/components/ErrorBoundary.jsx`):
  - Catches JavaScript errors in React component tree
  - Displays user-friendly error messages
  - Shows detailed error information in development mode
  - Allows users to reset and try again

#### Browser Developer Tools
- Use React DevTools for component inspection
- Use Network tab to monitor API calls
- Use Console for logging and debugging

### 3. Common Debugging Scenarios

#### Database Connection Issues
```javascript
// Check MongoDB connection
mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});
```

#### Authentication Issues
```javascript
// Verify JWT token
const token = req.headers.authorization?.split(' ')[1];
console.log('Token:', token);
```

#### API Response Issues
```javascript
// Log API responses
console.log('Response status:', res.status);
console.log('Response body:', res.body);
```

## Testing Tools

- **Jest**: JavaScript testing framework
  - Used for unit and integration tests
  - Provides mocking capabilities
  - Generates code coverage reports

- **React Testing Library**: Testing utilities for React
  - Renders components in isolation
  - Queries DOM elements
  - Simulates user interactions

- **Supertest**: HTTP assertions for API testing
  - Makes HTTP requests to Express app
  - Asserts response status and body
  - Works seamlessly with Jest

- **Cypress**: End-to-end testing framework
  - Tests complete user workflows
  - Provides visual testing interface
  - Records test execution videos

- **MongoDB Memory Server**: In-memory MongoDB for testing
  - Creates isolated database instances
  - No need for external MongoDB connection
  - Automatically cleans up after tests

## Project Features

### Server Features
- User authentication (JWT-based)
- User authorization (role-based)
- CRUD operations for posts
- Input validation
- Error handling
- Request logging
- Database indexing

### Client Features
- React components with error boundaries
- Custom hooks for data fetching
- API integration with axios
- Token management
- Responsive UI components

## Submission Requirements

Your submission should include:

1. ✅ Complete test files for unit, integration, and end-to-end testing
2. ✅ At least 70% code coverage for unit tests (Current: 88.28% statements, 89.50% lines)
3. ✅ Documentation of testing strategy (this README)
4. ✅ Screenshots of test coverage reports (See screenshots above)
5. ✅ Debugging techniques implemented (error boundaries, error handlers, logging)

## Best Practices

### Writing Tests
- Follow AAA pattern (Arrange, Act, Assert)
- Use descriptive test names
- Test one thing per test case
- Keep tests independent
- Use meaningful assertions

### Test Organization
- Group related tests using `describe` blocks
- Use `beforeAll`/`afterAll` for setup/teardown
- Use `beforeEach`/`afterEach` for test isolation

### Debugging
- Use logging strategically (not everywhere)
- Provide meaningful error messages
- Handle errors gracefully
- Test error scenarios

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library Documentation](https://testing-library.com/docs/react-testing-library/intro/)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Testing Best Practices](https://www.mongodb.com/blog/post/mongodb-testing-best-practices)

## Troubleshooting

### Tests Not Running
- Ensure all dependencies are installed: `npm run install-all`
- Check Node.js version: `node --version` (should be v18+)
- Clear node_modules and reinstall if needed

### MongoDB Connection Issues
- Ensure MongoDB is running (local) or connection string is correct (Atlas)
- Check `.env` file configuration
- Verify network connectivity

### Coverage Not Meeting Threshold
- Review uncovered code paths
- Add more test cases for edge cases
- Ensure all branches are tested

### Cypress Tests Failing
- Ensure both client and server are running
- Check baseUrl in `cypress.config.js`
- Verify API endpoints are accessible

## License

This project is part of a learning assignment.

---

**Note**: This is a comprehensive testing and debugging assignment. Make sure to understand each testing approach and debugging technique before submission.
