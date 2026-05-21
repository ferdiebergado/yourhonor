import { db } from '@backend/db';
import { findActiveBanks } from '@backend/features/bank/repo';
import { checkMethod } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);
    await getSession(req);

    const data = await findActiveBanks(db);

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
