import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { UnauthorizedError } from '@backend/errors';
import { checkMethod } from '@backend/http';
import { getSession } from '@backend/session';
import findUser from '@backend/user/repo';
import type { Profile } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['GET']);

  const { userId } = await getSession(req);

  const user = await findUser(db, userId);

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

export default withErrorHandling(handler);
