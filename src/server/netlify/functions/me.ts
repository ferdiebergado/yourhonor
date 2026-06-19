import { db } from '@server/db';
import { UnauthorizedError } from '@server/errors';
import type { HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import type { AppRequest, NetlifyFunction } from '@server/types';
import findUser from '@server/user/repo';
import type { Profile } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

const handler: NetlifyFunction = async (request: AppRequest) => {
  const allowedMethod: HttpMethod = 'GET';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

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
};

export default withMiddlewares(handler);
