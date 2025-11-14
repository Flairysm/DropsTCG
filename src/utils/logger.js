/**
 * Logging Service
 * 
 * Centralized logging utility to replace console.log statements.
 * Provides different log levels and can be extended for remote logging.
 */

const LOG_LEVELS = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
  NONE: 4,
};

// Set log level based on environment
const LOG_LEVEL = __DEV__ ? LOG_LEVELS.DEBUG : LOG_LEVELS.ERROR;

const formatMessage = (level, message, data = null) => {
  const timestamp = new Date().toISOString();
  const prefix = `[${timestamp}] [${level}]`;
  
  if (data) {
    return { prefix, message, data };
  }
  return { prefix, message };
};

export const logger = {
  debug: (message, data = null) => {
    if (LOG_LEVEL <= LOG_LEVELS.DEBUG) {
      const formatted = formatMessage('DEBUG', message, data);
      if (data) {
        console.log(formatted.prefix, formatted.message, formatted.data);
      } else {
        console.log(formatted.prefix, formatted.message);
      }
    }
  },

  info: (message, data = null) => {
    if (LOG_LEVEL <= LOG_LEVELS.INFO) {
      const formatted = formatMessage('INFO', message, data);
      if (data) {
        console.info(formatted.prefix, formatted.message, formatted.data);
      } else {
        console.info(formatted.prefix, formatted.message);
      }
    }
  },

  warn: (message, data = null) => {
    if (LOG_LEVEL <= LOG_LEVELS.WARN) {
      const formatted = formatMessage('WARN', message, data);
      if (data) {
        console.warn(formatted.prefix, formatted.message, formatted.data);
      } else {
        console.warn(formatted.prefix, formatted.message);
      }
    }
  },

  error: (message, error = null, data = null) => {
    if (LOG_LEVEL <= LOG_LEVELS.ERROR) {
      const formatted = formatMessage('ERROR', message, data);
      if (error) {
        console.error(formatted.prefix, formatted.message, error, formatted.data || '');
      } else if (data) {
        console.error(formatted.prefix, formatted.message, formatted.data);
      } else {
        console.error(formatted.prefix, formatted.message);
      }
      
      // TODO: In production, send to error tracking service (e.g., Sentry)
      // if (!__DEV__) {
      //   errorTrackingService.captureException(error || new Error(message), { extra: data });
      // }
    }
  },
};

export default logger;

