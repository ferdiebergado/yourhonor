import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { findActivePositions } from '@backend/features/position/repo';
import { checkMethod } from '@backend/http';
import { getSession } from '@backend/session';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['GET']);
  await getSession(req);

  const data = await findActivePositions(db);

  const payload: ApiResponse<typeof data> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

export default withErrorHandling(handler);
