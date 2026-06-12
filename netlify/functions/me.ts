import { db } from '@backend/db';
import { UnauthorizedError } from '@backend/errors';
import { withMiddlewares, type AuthenticatedRequest } from '@backend/http/middlewares';
import findUser from '@backend/user/repo';
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

  const payload: ApiResponse<typeof data> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

export default withMiddlewares(handler);
