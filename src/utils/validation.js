/**
 * Validation Utilities
 * 
 * Centralized validation functions for form inputs and data
 */

/**
 * Email validation
 */
export const validateEmail = (email) => {
  if (!email || !email.trim()) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true, error: null };
};

/**
 * Password validation
 */
export const validatePassword = (password, minLength = 6) => {
  if (!password || !password.trim()) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  return { isValid: true, error: null };
};

/**
 * Username validation
 */
export const validateUsername = (username, minLength = 3, maxLength = 20) => {
  if (!username || !username.trim()) {
    return { isValid: false, error: 'Username is required' };
  }

  const trimmed = username.trim();

  if (trimmed.length < minLength) {
    return { isValid: false, error: `Username must be at least ${minLength} characters` };
  }

  if (trimmed.length > maxLength) {
    return { isValid: false, error: `Username must be no more than ${maxLength} characters` };
  }

  // Allow alphanumeric, underscore, and hyphen
  const usernameRegex = /^[a-zA-Z0-9_-]+$/;
  if (!usernameRegex.test(trimmed)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { isValid: true, error: null };
};

/**
 * Phone number validation
 */
export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  if (!phoneRegex.test(phone.trim())) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  const digitsOnly = phone.replace(/\D/g, '');
  if (digitsOnly.length < 8) {
    return { isValid: false, error: 'Phone number must contain at least 8 digits' };
  }

  return { isValid: true, error: null };
};

/**
 * Confirm password validation
 */
export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword || !confirmPassword.trim()) {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true, error: null };
};

/**
 * Required field validation
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true, error: null };
};

/**
 * Number validation
 */
export const validateNumber = (value, min = null, max = null) => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, error: 'Number is required' };
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, error: 'Please enter a valid number' };
  }

  if (min !== null && num < min) {
    return { isValid: false, error: `Value must be at least ${min}` };
  }

  if (max !== null && num > max) {
    return { isValid: false, error: `Value must be no more than ${max}` };
  }

  return { isValid: true, error: null };
};

/**
 * Validate multiple fields at once
 */
export const validateFields = (validations) => {
  const errors = {};
  let isValid = true;

  Object.keys(validations).forEach((field) => {
    const result = validations[field]();
    if (!result.isValid) {
      errors[field] = result.error;
      isValid = false;
    }
  });

  return { isValid, errors };
};

export default {
  validateEmail,
  validatePassword,
  validateUsername,
  validatePhone,
  validateConfirmPassword,
  validateRequired,
  validateNumber,
  validateFields,
};

