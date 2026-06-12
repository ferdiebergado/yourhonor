import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { findActiveActivitiesByUser } from '@backend/features/activity/repo';
import { checkMethod } from '@backend/http';
import { getSession } from '@backend/session';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['GET']);

  const { userId } = await getSession(req);
  const data = await findActiveActivitiesByUser(db, userId);

  const payload: ApiResponse<typeof data> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

export default withErrorHandling(handler);
