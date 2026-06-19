import type { Context, EdgeFunction } from '@netlify/edge-functions';

import { getRequestContext } from '../../../server/http/index.ts';
import { API_BASE_URL, SESSION } from '../../../shared/constants.ts';
import { ERROR_CODES, type ApiResponse } from '../../../shared/types/index.ts';

const session: EdgeFunction = async (request: Request, context: Context) => {
  const sessionId = context.cookies.get(SESSION.COOKIE_NAME);

  if (sessionId) {
    request.headers.set(SESSION.HEADER_NAME, sessionId);
    return await context.next();
  }

  const msg = 'No session cookie';
  const meta = { ...getRequestContext(request, context) };
  console.warn(msg, { meta });

  const url = new URL(request.url);
  if (url.pathname.startsWith(API_BASE_URL + '/')) {
    const payload: ApiResponse = {
      success: false,
      error: { code: ERROR_CODES.UNAUTHORIZED, message: msg },
    };

    return Response.json(payload, { status: 401 });
  }

  return Response.redirect('/signin', 302);
};

export default session;
