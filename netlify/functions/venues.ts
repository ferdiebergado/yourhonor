import { getDb } from '@backend/db';
import { checkMethod } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { findActiveVenues } from '@backend/venue/repo';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const db = await getDb();
    const venues = await findActiveVenues(db);

    const payload: ApiResponse<typeof venues> = {
      success: true,
      data: venues,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
