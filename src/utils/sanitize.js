/**
 * Content sanitization utilities for XSS prevention.
 * Defense-in-depth: React already escapes JSX output and Supabase uses
 * parameterized queries, but this adds an input-time sanitization layer.
 */

/**
 * HTML entities for escaping special characters.
 */
const HTML_ENTITIES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;'
};

/**
 * Regex pattern for HTML special characters.
 */
const HTML_SPECIAL_CHARS = /[&<>"']/g;

/**
 * Sanitizes user-provided content to prevent XSS attacks.
 * - Returns empty string for null/undefined
 * - Trims whitespace
 * - Escapes HTML special characters: < > & " '
 *
 * @param {string|null|undefined} input - User input to sanitize
 * @returns {string} - Sanitized string safe for display
 */
export function sanitizeUserContent(input) {
  // Return empty string for null/undefined
  if (input == null) {
    return '';
  }

  // Convert to string if not already
  const str = String(input);

  // Trim whitespace
  const trimmed = str.trim();

  // Escape HTML special characters
  return trimmed.replace(HTML_SPECIAL_CHARS, char => HTML_ENTITIES[char]);
}

/**
 * Default maximum length for database text fields.
 */
const DEFAULT_MAX_LENGTH = 10000;

/**
 * Sanitizes user content for database storage.
 * - Applies all sanitizeUserContent transformations
 * - Strips null bytes (\0) that could cause issues
 * - Trims to maximum length to prevent oversized data
 *
 * @param {string|null|undefined} input - User input to sanitize
 * @param {number} [maxLength=10000] - Maximum allowed length
 * @returns {string} - Sanitized string safe for database storage
 */
export function sanitizeForDatabase(input, maxLength = DEFAULT_MAX_LENGTH) {
  // First apply user content sanitization
  const sanitized = sanitizeUserContent(input);

  // Strip null bytes
  const withoutNullBytes = sanitized.replace(/\0/g, '');

  // Trim to max length
  if (withoutNullBytes.length > maxLength) {
    return withoutNullBytes.slice(0, maxLength);
  }

  return withoutNullBytes;
}
