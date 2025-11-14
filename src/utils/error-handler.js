/**
 * Centralized Error Handler
 * 
 * Provides consistent error handling and user-friendly error messages
 * across the application.
 */

import { Alert } from 'react-native';
import { logger } from './logger';

/**
 * Error types for categorization
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  AUTH: 'AUTH',
  VALIDATION: 'VALIDATION',
  PERMISSION: 'PERMISSION',
  NOT_FOUND: 'NOT_FOUND',
  SERVER: 'SERVER',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Get user-friendly error message based on error type
 */
const getUserFriendlyMessage = (error, errorType) => {
  const errorMessage = error?.message || error?.toString() || 'An unexpected error occurred';
  const lowerMessage = errorMessage.toLowerCase();

  switch (errorType) {
    case ERROR_TYPES.NETWORK:
      if (lowerMessage.includes('network') || lowerMessage.includes('connection') || lowerMessage.includes('fetch')) {
        return 'Network error. Please check your internet connection and try again.';
      }
      return 'Unable to connect to the server. Please check your internet connection.';

    case ERROR_TYPES.AUTH:
      if (lowerMessage.includes('email not confirmed') || lowerMessage.includes('email not verified')) {
        return 'Please verify your email address before signing in. Check your inbox for the verification link.';
      }
      if (lowerMessage.includes('invalid login credentials') || lowerMessage.includes('invalid credentials')) {
        return 'Invalid email or password. Please check your credentials and try again.';
      }
      if (lowerMessage.includes('too many requests') || lowerMessage.includes('rate limit')) {
        return 'Too many attempts. Please wait a few minutes and try again.';
      }
      if (lowerMessage.includes('user not found')) {
        return 'No account found with this email address. Please check your email or sign up.';
      }
      return 'Authentication failed. Please try again.';

    case ERROR_TYPES.VALIDATION:
      return errorMessage || 'Please check your input and try again.';

    case ERROR_TYPES.PERMISSION:
      return 'You do not have permission to perform this action.';

    case ERROR_TYPES.NOT_FOUND:
      return 'The requested resource was not found.';

    case ERROR_TYPES.SERVER:
      return 'Server error. Please try again later.';

    case ERROR_TYPES.UNKNOWN:
    default:
      return 'An unexpected error occurred. Please try again.';
  }
};

/**
 * Detect error type from error object
 */
const detectErrorType = (error) => {
  const errorMessage = error?.message || error?.toString() || '';
  const lowerMessage = errorMessage.toLowerCase();
  const errorCode = error?.code || '';

  // Network errors
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('connection') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('timeout') ||
    errorCode === 'ECONNREFUSED' ||
    errorCode === 'ETIMEDOUT'
  ) {
    return ERROR_TYPES.NETWORK;
  }

  // Auth errors
  if (
    lowerMessage.includes('email not confirmed') ||
    lowerMessage.includes('email not verified') ||
    lowerMessage.includes('invalid login') ||
    lowerMessage.includes('invalid credentials') ||
    lowerMessage.includes('user not found') ||
    lowerMessage.includes('too many requests') ||
    errorCode === 'invalid_credentials' ||
    errorCode === 'invalid_grant' ||
    errorCode === 'too_many_requests'
  ) {
    return ERROR_TYPES.AUTH;
  }

  // Permission errors
  if (
    lowerMessage.includes('permission') ||
    lowerMessage.includes('forbidden') ||
    lowerMessage.includes('unauthorized') ||
    errorCode === '42501' || // RLS policy violation
    errorCode === '403'
  ) {
    return ERROR_TYPES.PERMISSION;
  }

  // Not found errors
  if (
    lowerMessage.includes('not found') ||
    errorCode === 'PGRST116' || // Supabase no rows returned
    errorCode === '404'
  ) {
    return ERROR_TYPES.NOT_FOUND;
  }

  // Server errors
  if (
    lowerMessage.includes('server error') ||
    lowerMessage.includes('internal server') ||
    errorCode === '500' ||
    errorCode === '502' ||
    errorCode === '503'
  ) {
    return ERROR_TYPES.SERVER;
  }

  return ERROR_TYPES.UNKNOWN;
};

/**
 * Handle error with logging and user notification
 */
export const handleError = (error, context = '', showAlert = true) => {
  const errorType = detectErrorType(error);
  const userMessage = getUserFriendlyMessage(error, errorType);

  // Log error
  logger.error(`Error in ${context || 'unknown context'}`, error, {
    errorType,
    errorCode: error?.code,
    errorMessage: error?.message,
  });

  // Show alert if requested
  if (showAlert) {
    Alert.alert('Error', userMessage, [{ text: 'OK' }]);
  }

  return {
    type: errorType,
    message: userMessage,
    originalError: error,
  };
};

/**
 * Handle error silently (log only, no user notification)
 */
export const handleErrorSilently = (error, context = '') => {
  return handleError(error, context, false);
};

/**
 * Create a standardized error response
 */
export const createErrorResponse = (message, errorType = ERROR_TYPES.UNKNOWN, originalError = null) => {
  return {
    success: false,
    error: message,
    errorType,
    originalError,
  };
};

/**
 * Wrap async function with error handling
 */
export const withErrorHandling = (asyncFn, context = '') => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      return handleError(error, context, false);
    }
  };
};

export default {
  handleError,
  handleErrorSilently,
  createErrorResponse,
  withErrorHandling,
  ERROR_TYPES,
};

