import { getDb } from '@backend/db';
import { checkMethod } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { findActivePositions } from '@backend/position/repo';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const db = await getDb();
    const data = await findActivePositions(db);

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
