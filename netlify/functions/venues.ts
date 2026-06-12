import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { findActiveVenues } from '@backend/features/venue/repo';
import { checkMethod } from '@backend/http';
import { getSession } from '@backend/session';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['GET']);
  await getSession(req);

  const venues = await findActiveVenues(db);

  const payload: ApiResponse<typeof venues> = {
    success: true,
    data: venues,
  };

  return Response.json(payload);
}

export default withErrorHandling(handler);
