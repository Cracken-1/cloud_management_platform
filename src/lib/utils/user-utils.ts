/**
 * Utility functions for user data processing
 */

/**
 * Safely compute full name from first and last name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Computed full name or empty string if both are null/undefined
 */
export function getFullName(firstName?: string | null, lastName?: string | null): string {
  const first = firstName?.trim() || '';
  const last = lastName?.trim() || '';
  
  if (!first && !last) return '';
  if (!first) return last;
  if (!last) return first;
  
  return `${first} ${last}`;
}

/**
 * Sanitize user input to prevent XSS attacks
 * @param input - Raw user input
 * @returns Sanitized string
 */
export function sanitizeUserInput(input?: string | null): string {
  if (!input) return '';
  return input.replace(/[<>\"'&]/g, '');
}