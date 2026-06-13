import { db } from '@server/db';
import { UnauthorizedError } from '@server/errors';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import findUser from '@server/user/repo';
import type { Profile } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handler(request: AuthenticatedRequest) {
  if (request.method !== 'GET')
    return new Response(undefined, { status: 405, headers: { Allow: 'GET' } });

  const user = await findUser(db, request.session.userId);

  if (!user) throw new UnauthorizedError('user not found');

  const data: Profile = {
    name: user.name,
    email: user.email,
    picture: user.picture,
  };

  const payload: ApiResponse<Profile> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

export default withMiddlewares(handler);
