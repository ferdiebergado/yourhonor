import type { Context } from '@netlify/functions';
import * as z from 'zod';

import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import logger from '@backend/logger';
import { signin } from '@backend/oauth';
import { bakeSessionCookie } from '@backend/session/cookie';
import type { Profile } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

export default async (req: Request, ctx: Context) => {
  try {
    checkMethod(req, ['POST']);

    logger.info('Signing in user...');

    const schema = z.object({
      code: z.string().trim().min(20).max(512),
    });
    const { code } = await parseJson(req, schema);
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
  } catch (error) {
    return respondWithError(error);
  }
};
