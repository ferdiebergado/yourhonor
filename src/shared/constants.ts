export const API_BASE_URL = '/api';

// Hint: copy in edge-functions/response.ts
export const CSP_NONCE_PLACEHOLDER = '__CSP_NONCE__';
export const GOOGLE_ACCOUNTS_ORIGIN = 'https://accounts.google.com';

// Hint: copy in edge-functions/session.ts
export const SESSION = {
  COOKIE_NAME: '__Host-session',
  ID_LENGTH: 32,
  DURATION_MINUTES: 60 * 24 * 30 * 3, // 90 days
  HEADER_NAME: 'x-session-id',
} as const;

export const SG29 = 187_531;
