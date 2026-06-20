import type { Context } from '@netlify/edge-functions';

import config from '@server/config';
import { OAUTH_STATE_COOKIE, signin } from '@server/features/auth/google';
import { getBaseRequestContext } from '@server/http';
import { logRequest, withErrorHandler } from '@server/http/middlewares';
import logger from '@server/logger';
import { bakeSessionCookie } from '@server/session/cookie';
import type { AppRequest, Cookie, NetlifyFunction } from '@server/types';

const handler: NetlifyFunction = async (request: AppRequest, context: Context) => {
  const { searchParams } = new URL(request.url);
  const authCode = searchParams.get('code');
  const state = searchParams.get('state');

  const savedState = context.cookies.get(OAUTH_STATE_COOKIE);

  const expiredStateCookie: Cookie = {
    name: OAUTH_STATE_COOKIE,
    value: '',
    path: '/',
    maxAge: 0,
    secure: true,
    httpOnly: true,
    sameSite: 'Lax',
  };
  context.cookies.set(expiredStateCookie);

  const { host } = config;

  if (!authCode || !state || state !== savedState) {
    const signinUrl = new URL(`${host}/signin`);
    signinUrl.searchParams.set('error', 'Access denied.');
    logger.warn({ ...getBaseRequestContext(request, context), msg: 'Signin failed.' });

    return Response.redirect(signinUrl);
  }

  const { user, sessionId, expiresAt } = await signin(authCode);

  const sessionCookie = bakeSessionCookie(sessionId, expiresAt);
  context.cookies.set(sessionCookie);

  logger.info({
    timestamp: new Date().toISOString(),
    requestId: context.requestId,
    msg: 'User signed in.',
    event: 'auth.signin.success',
    userId: user.googleId,
  });

  const dashboardUrl = new URL(host);
  dashboardUrl.searchParams.set('success', 'Signed in succesfully.');

  return Response.redirect(dashboardUrl);
};

export default withErrorHandler(logRequest(handler));
