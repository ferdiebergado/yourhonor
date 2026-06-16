import type { Context } from '@netlify/functions';

import { handleError } from '@server/error-handler';
import logger from '@server/logger';
import { getSession, type Session } from '@server/session';
import { getBaseRequestContext, getRequestContext } from '.';

export type AuthenticatedRequest = Request & { session: Session };
export type NetlifyHandler = (request: AuthenticatedRequest, context: Context) => Promise<Response>;

type Middleware = (handler: NetlifyHandler) => NetlifyHandler;

export const withLogger: Middleware = (handler: NetlifyHandler) => {
  return async (request, context) => {
    const start = performance.now();
    const response = await handler(request, context);
    const durationMs = Math.round(performance.now() - start);

    logger.info({
      ...getBaseRequestContext(request, context),
      statusCode: response.status,
      durationInMs: durationMs,
    });

    return response;
  };
};

export const withSession: Middleware = (handler: NetlifyHandler) => {
  return async (request, context) => {
    const session = await getSession(request);
    request.session = session;
    return await handler(request, context);
  };
};

export const withErrorHandling: Middleware = (handler: NetlifyHandler) => {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const requestContext = getRequestContext(request, context);
      return handleError(error, requestContext);
    }
  };
};

export const withMiddlewares: Middleware = (handler: NetlifyHandler) =>
  withErrorHandling(withLogger(withSession(handler)));
