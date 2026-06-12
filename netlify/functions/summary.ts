import { db } from '@backend/db';
import { getSummary, type Summary } from '@backend/features/summary/repo';
import { withMiddlewares } from '@backend/http/middlewares';
import type { ApiResponse } from '@shared/types';

async function handler() {
  const summary = await getSummary(db);

  const payload: ApiResponse<Summary> = {
    success: true,
    data: summary,
  };

  return Response.json(payload);
}

export default withMiddlewares(handler);
