import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
  getUsernameFromEmail
} from './validation';

describe('validateEmail', () => {
  it('returns invalid for empty string', () => {
    expect(validateEmail('')).toEqual({ valid: false, message: 'Email is required' });
  });

  it('returns invalid for whitespace-only string', () => {
    expect(validateEmail('   ')).toEqual({ valid: false, message: 'Email is required' });
  });

  it('returns invalid for string without @', () => {
    expect(validateEmail('notanemail')).toEqual({ valid: false, message: 'Please enter a valid email address' });
  });

  it('returns invalid for string without domain', () => {
    expect(validateEmail('missing@domain')).toEqual({ valid: false, message: 'Please enter a valid email address' });
  });

  it('returns valid for proper email', () => {
    expect(validateEmail('user@example.com')).toEqual({ valid: true });
  });

  it('returns valid for email with surrounding whitespace (trims)', () => {
    expect(validateEmail(' user@example.com ')).toEqual({ valid: true });
  });
});

describe('validatePassword', () => {
  it('returns invalid for empty string', () => {
    expect(validatePassword('')).toEqual({ valid: false, message: 'Password is required' });
  });

  it('returns invalid for null', () => {
    expect(validatePassword(null)).toEqual({ valid: false, message: 'Password is required' });
  });

  it('returns invalid for password shorter than default minLength (6)', () => {
    expect(validatePassword('12345')).toEqual({ valid: false, message: 'Password must be at least 6 characters' });
  });

  it('returns valid for password meeting default minLength (6)', () => {
    expect(validatePassword('123456')).toEqual({ valid: true });
  });

  it('returns invalid for password shorter than custom minLength', () => {
    expect(validatePassword('12', 3)).toEqual({ valid: false, message: 'Password must be at least 3 characters' });
  });

  it('returns valid for password meeting custom minLength', () => {
    expect(validatePassword('123', 3)).toEqual({ valid: true });
  });
});

describe('validateRequired', () => {
  it('returns invalid for empty string', () => {
    expect(validateRequired('', 'Name')).toEqual({ valid: false, message: 'Name is required' });
  });

  it('returns invalid for whitespace-only string', () => {
    expect(validateRequired('   ', 'Email')).toEqual({ valid: false, message: 'Email is required' });
  });

  it('returns valid for non-empty value', () => {
    expect(validateRequired('value', 'Field')).toEqual({ valid: true });
  });

  it('uses fieldName in error message', () => {
    expect(validateRequired('', 'Custom Field')).toEqual({ valid: false, message: 'Custom Field is required' });
  });
});

describe('getUsernameFromEmail', () => {
  it('returns "user" for null', () => {
    expect(getUsernameFromEmail(null)).toBe('user');
  });

  it('returns "user" for undefined', () => {
    expect(getUsernameFromEmail(undefined)).toBe('user');
  });

  it('returns "user" for non-string value', () => {
    expect(getUsernameFromEmail(123)).toBe('user');
  });

  it('returns "user" for empty string', () => {
    expect(getUsernameFromEmail('')).toBe('user');
  });

  it('extracts username from email', () => {
    expect(getUsernameFromEmail('test@example.com')).toBe('test');
  });

  it('returns string without @ as-is', () => {
    expect(getUsernameFromEmail('hello')).toBe('hello');
  });

  it('handles email with multiple @ symbols', () => {
    // Only takes first part before first @
    expect(getUsernameFromEmail('user@domain@extra.com')).toBe('user');
  });
});
