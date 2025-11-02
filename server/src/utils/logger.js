/**
 * Simple logger utility for server-side debugging
 * In production, consider using winston or similar
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const logLevels = {
  ERROR: 'ERROR',
  WARN: 'WARN',
  INFO: 'INFO',
  DEBUG: 'DEBUG'
};

/**
 * Format timestamp
 */
const getTimestamp = () => {
  return new Date().toISOString();
};

/**
 * Log error message
 */
const error = (message, ...args) => {
  console.error(
    `${colors.red}[${getTimestamp()}] [${logLevels.ERROR}]${colors.reset}`,
    message,
    ...args
  );
};

/**
 * Log warning message
 */
const warn = (message, ...args) => {
  console.warn(
    `${colors.yellow}[${getTimestamp()}] [${logLevels.WARN}]${colors.reset}`,
    message,
    ...args
  );
};

/**
 * Log info message
 */
const info = (message, ...args) => {
  console.log(
    `${colors.cyan}[${getTimestamp()}] [${logLevels.INFO}]${colors.reset}`,
    message,
    ...args
  );
};

/**
 * Log debug message
 */
const debug = (message, ...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(
      `${colors.magenta}[${getTimestamp()}] [${logLevels.DEBUG}]${colors.reset}`,
      message,
      ...args
    );
  }
};

/**
 * Log HTTP request
 */
const logRequest = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const statusColor = res.statusCode >= 400 ? colors.red : colors.green;
    
    console.log(
      `${colors.blue}[${getTimestamp()}]${colors.reset}`,
      `${statusColor}${req.method} ${req.path}${colors.reset}`,
      `${statusColor}${res.statusCode}${colors.reset}`,
      `${colors.yellow}${duration}ms${colors.reset}`
    );
  });
  
  if (next) next();
};

module.exports = {
  error,
  warn,
  info,
  debug,
  logRequest,
  logLevels
};

