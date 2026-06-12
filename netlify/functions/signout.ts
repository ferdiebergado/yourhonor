import { db } from '@backend/db';
import { NotFoundError } from '@backend/errors';
import { withMiddlewares, type AuthenticatedRequest } from '@backend/http/middlewares';
import { emptySessionCookie } from '@backend/session/cookie';
import { softDeleteSession } from '@backend/session/repo';
import type { Context } from '@netlify/functions';
import type { ApiResponse } from '@shared/types';

async function handler(request: AuthenticatedRequest, ctx: Context) {
  if (request.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

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
