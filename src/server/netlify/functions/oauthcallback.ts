import type { Context } from '@netlify/edge-functions';

import config from '@server/config';
import { OAUTH_STATE_COOKIE, signin } from '@server/features/auth/google';
import { logRequest, withErrorHandler } from '@server/http/middlewares';
import logger from '@server/logger';
import { bakeSessionCookie } from '@server/session/cookie';
import type { AppRequest, Cookie, NetlifyFunction } from '@server/types';

const handler: NetlifyFunction = async (request: AppRequest, context: Context) => {
  const searchParams = new URL(request.url).searchParams;
  const incomingCode = searchParams.get('code');
  const incomingState = searchParams.get('state');

  const storedState = context.cookies.get(OAUTH_STATE_COOKIE);

  const stateCookie: Cookie = {
    name: OAUTH_STATE_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  };
  context.cookies.set(stateCookie);

  const { host } = config;

  if (!incomingCode || !incomingState || incomingState !== storedState) {
    const url = new URL(`${host}/signin`);
    url.searchParams.set('error', 'Access denied.');

    return Response.redirect(url, 302);
  }

  const { user, sessionId, expiresAt } = await signin(incomingCode);

  const sessionCookie = bakeSessionCookie(sessionId, expiresAt);
  context.cookies.set(sessionCookie);

  logger.info({
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    msg: 'User signed in.',
    event: 'auth.signin.success',
    userId: user.googleId,
  });

  const url = new URL(`${host}`);
  url.searchParams.set('success', 'Signed in succesfully.');

  return Response.redirect(host, 302);
};

export default withErrorHandler(logRequest(handler));
