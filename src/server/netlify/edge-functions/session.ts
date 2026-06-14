import type { Context } from '@netlify/edge-functions';

import { API_BASE_URL, SESSION } from '../../../shared/constants.ts';
import { ERROR_CODES, type ApiResponse } from '../../../shared/types/index.ts';

export default (request: Request, context: Context) => {
  const sessionId = context.cookies.get(SESSION.COOKIE_NAME);

  if (sessionId) {
    request.headers.set(SESSION.HEADER_NAME, sessionId);
    return context.next();
  }

  const url = new URL(request.url);
  if (url.pathname.startsWith(API_BASE_URL + '/')) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: 'No session cookie' },
    };

    console.warn(payload.error.message);

    return Response.json(payload, { status: 401 });
  }

  return Response.redirect('/signin', 302);
};
