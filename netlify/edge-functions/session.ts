import type { Context } from '@netlify/edge-functions';

import { ERROR_CODES, type ApiResponse } from '@shared/types/index.js';

export const SESSION = {
  COOKIE_NAME: '__Host-session',
  ID_LENGTH: 32,
  DURATION_MINUTES: 60 * 24 * 30 * 3, // 90 days
  HEADER_NAME: 'x-session-id',
} as const;

export default (req: Request, ctx: Context) => {
  console.log('Looking for active session...');

  const sessionId = ctx.cookies.get(SESSION.COOKIE_NAME);
  if (!sessionId) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'No session cookie' },
    };

    console.warn(payload.error.message);

    return Response.json(payload, { status: 401 });
  }

  req.headers.set(SESSION.HEADER_NAME, sessionId);
};
