/**
 * Validation utility functions for form validation.
 * Simple, lightweight validation without heavy libraries.
 */

/**
 * Validate email format
 * @param {string} email
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateEmail(email) {
  if (!email || !email.trim()) {
    return { valid: false, message: 'Email is required' };
  }
  // Trim whitespace before validation
  const trimmedEmail = email.trim();
  // Simple email regex - not overly strict
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return { valid: false, message: 'Please enter a valid email address' };
  }
  return { valid: true };
}

/**
 * Validate password (for signup)
 * @param {string} password
 * @param {number} minLength - default 6
 * @returns {{ valid: boolean, message?: string }}
 */
export function validatePassword(password, minLength = 6) {
  if (!password) {
    return { valid: false, message: 'Password is required' };
  }
  if (password.length < minLength) {
    return { valid: false, message: `Password must be at least ${minLength} characters` };
  }
  return { valid: true };
}

/**
 * Validate required text field
 * @param {string} value
 * @param {string} fieldName - for error message
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateRequired(value, fieldName) {
  if (!value || !value.trim()) {
    return { valid: false, message: `${fieldName} is required` };
  }
  return { valid: true };
}

/**
 * Safely extract username from email (handles null/undefined)
 * @param {string|null|undefined} email
 * @returns {string}
 */
export function getUsernameFromEmail(email) {
  if (!email || typeof email !== 'string') {
    return 'user';
  }
  const parts = email.split('@');
  return parts[0] || 'user';
}
