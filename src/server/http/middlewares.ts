import type { Context } from '@netlify/functions';

import { handleError } from '@server/error-handler';
import { getSession, type Session } from '@server/session';

export type AuthenticatedRequest = Request & {
  session: Session;
};

export type NetlifyHandler = (request: AuthenticatedRequest, context: Context) => Promise<Response>;

export function withSession(handler: NetlifyHandler): NetlifyHandler {
  return async (request, context) => {
    const session = await getSession(request);
    request.session = session;
    return await handler(request, context);
  };
}

export function withErrorHandling(handler: NetlifyHandler): NetlifyHandler {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return handleError(error, context.requestId);
    }
  };
}

export const withMiddlewares = (handler: NetlifyHandler): NetlifyHandler =>
  withErrorHandling(withSession(handler));
