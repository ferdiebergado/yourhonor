import type { Context } from '@netlify/functions';
import * as z from 'zod';

import { parseJson } from '@server/http';
import { withErrorHandling } from '@server/http/middlewares';
import logger from '@server/logger';
import { signin } from '@server/oauth';
import { bakeSessionCookie } from '@server/session/cookie';
import type { Profile } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

const authCodeSchema = z.object({
  code: z.string().trim().min(20).max(512),
});

async function handler(request: Request, ctx: Context) {
  if (request.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  logger.info('Signing in user...');

  const { code } = await parseJson(request, authCodeSchema);
  const { user, sessionId, expiresAt } = await signin(code);

  const sessionCookie = bakeSessionCookie(sessionId, expiresAt);
  ctx.cookies.set(sessionCookie);

  const data: Profile = {
    email: user.email,
    name: user.name,
    picture: user.picture,
  };

  const payload: ApiResponse<Profile> = {
    success: true,
    data,
  };

  logger.info('User signed in.');

  return Response.json(payload);
}

export default withErrorHandling(handler);
