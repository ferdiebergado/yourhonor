import { handleError } from '@server/error-handler';
import logger from '@server/logger';
import { getSession } from '@server/session';
import type { NetlifyFunction } from '@server/types';
import { getBaseRequestContext, getRequestContext } from '.';

type Middleware = (handler: NetlifyFunction) => NetlifyFunction;

export const withMiddlewares: Middleware = (handler: NetlifyFunction) =>
  withErrorHandler(logRequest(attachSession(handler)));

export const withErrorHandler: Middleware = (handler: NetlifyFunction) => {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      const requestContext = getRequestContext(request, context);
      return handleError(error, requestContext);
    }
  };
};

export const logRequest: Middleware = (handler: NetlifyFunction) => {
  return async (request, context) => {
    const start = performance.now();
    const response = await handler(request, context);
    const durationMs = Math.round(performance.now() - start);

    logger.info({
      msg: 'Request completed.',
      ...getBaseRequestContext(request, context),
      statusCode: response.status,
      durationMs,
    });

    return response;
  };
};

export const attachSession: Middleware = (handler: NetlifyFunction) => {
  return async (request, context) => {
    const session = await getSession(request);
    request.session = session;
    return await handler(request, context);
  };
};
