import type { Context } from '@netlify/functions';

import { db } from '@server/db';
import { NotFoundError } from '@server/errors';
import type { HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { emptySessionCookie } from '@server/session/cookie';
import { softDeleteSession } from '@server/session/repo';
import type { ApiResponse } from '@shared/types';

async function handler(request: AuthenticatedRequest, ctx: Context) {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const isDeleted = await softDeleteSession(db, request.session.sessionId);

  if (!isDeleted) throw new NotFoundError('Session not found or already deleted.');

  const payload: ApiResponse = {
    success: true,
  };

  const sessionCookie = emptySessionCookie();
  ctx.cookies.set(sessionCookie);
  return Response.json(payload);
}

export default withMiddlewares(handler);
