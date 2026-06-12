import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { checkMethod } from '@backend/http';
import { getSession } from '@backend/session';
import { emptySessionCookie } from '@backend/session/cookie';
import { softDeleteSession } from '@backend/session/repo';
import type { Context } from '@netlify/functions';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request, ctx: Context) {
  checkMethod(req, ['POST']);

  const { sessionId } = await getSession(req);

  const isDeleted = await softDeleteSession(db, sessionId);

  if (!isDeleted) throw new NotFoundError('Session not found or already deleted.');

  const payload: ApiResponse = {
    success: true,
  };

  const sessionCookie = emptySessionCookie();
  ctx.cookies.set(sessionCookie);
  return Response.json(payload);
}

export default withErrorHandling(handler);
