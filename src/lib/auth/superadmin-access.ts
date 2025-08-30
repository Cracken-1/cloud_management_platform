// Authorized superadmin email addresses
// In production, this should be stored in environment variables or database
const AUTHORIZED_SUPERADMIN_EMAILS = [
  'admin@infinitystack.com',
  'superadmin@infinitystack.com',
  'alphoncewekesamukaisi@gmail.com',
  // Add more authorized emails as needed
];

export function isAuthorizedSuperadmin(email: string): boolean {
  return AUTHORIZED_SUPERADMIN_EMAILS.includes(email.toLowerCase());
}

export function getAuthorizedEmails(): string[] {
  return [...AUTHORIZED_SUPERADMIN_EMAILS];
}