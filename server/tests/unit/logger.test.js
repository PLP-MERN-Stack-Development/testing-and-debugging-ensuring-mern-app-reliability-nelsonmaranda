const logger = require('../../src/utils/logger');

describe('Logger Utility Functions', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console methods
    consoleSpy = {
      error: jest.spyOn(console, 'error').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      log: jest.spyOn(console, 'log').mockImplementation()
    };
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('error', () => {
    it('should log error messages', () => {
      logger.error('Test error message');
      
      expect(consoleSpy.error).toHaveBeenCalledTimes(1);
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.any(String),
        'Test error message'
      );
    });

    it('should log error with additional arguments', () => {
      const errorObj = { code: 500, message: 'Internal error' };
      logger.error('Error occurred', errorObj);
      
      expect(consoleSpy.error).toHaveBeenCalledWith(
        expect.any(String),
        'Error occurred',
        errorObj
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      logger.warn('Test warning message');
      
      expect(consoleSpy.warn).toHaveBeenCalledTimes(1);
      expect(consoleSpy.warn).toHaveBeenCalledWith(
        expect.any(String),
        'Test warning message'
      );
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      logger.info('Test info message');
      
      expect(consoleSpy.log).toHaveBeenCalledTimes(1);
      expect(consoleSpy.log).toHaveBeenCalledWith(
        expect.any(String),
        'Test info message'
      );
    });
  });

  describe('debug', () => {
    it('should log debug messages in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';
      
      logger.debug('Test debug message');
      
      expect(consoleSpy.log).toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });

    it('should not log debug messages in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';
      
      logger.debug('Test debug message');
      
      expect(consoleSpy.log).not.toHaveBeenCalled();
      
      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('logRequest', () => {
    it('should be a function', () => {
      expect(typeof logger.logRequest).toBe('function');
    });
  });
});

