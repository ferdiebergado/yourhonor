import type { Context } from '@netlify/functions';
import { randomBytes } from 'node:crypto';

import { generateAuthUrl, OAUTH_STATE_COOKIE } from '@server/features/auth/google';
import { type HttpMethod } from '@server/http';
import { logRequest, withErrorHandler } from '@server/http/middlewares';
import type { AppRequest, Cookie, NetlifyFunction } from '@server/types';

const handler: NetlifyFunction = async (request: AppRequest, context: Context) => {
  const allowedMethod: HttpMethod = 'GET';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const state = randomBytes(32).toString('base64url');

  const authUrl = generateAuthUrl(state);

  const stateCookie: Cookie = {
    name: OAUTH_STATE_COOKIE,
    value: state,
    path: '/',
    maxAge: 300,
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  };

  context.cookies.set(stateCookie);

  return Response.redirect(authUrl, 302);
};

export default withErrorHandler(logRequest(handler));
