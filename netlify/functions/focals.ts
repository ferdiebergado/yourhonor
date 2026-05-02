import { getDb } from '@backend/db';
import { findActiveFocals } from '@backend/focal/repo';
import { checkMethod } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const db = await getDb();
    const focals = await findActiveFocals(db);

    const payload: ApiResponse<typeof focals> = {
      success: true,
      data: focals,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
