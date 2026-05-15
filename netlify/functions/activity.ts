import { getDb } from '@backend/db';
import { findActiveActivityByUser } from '@backend/features/activity/repo';
import { checkMethod, parseSearchParams } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const { userId } = await getSession(req);

    const { code } = parseSearchParams(req, ActivityCodeSchema);

    const db = await getDb();
    const data = await findActiveActivityByUser(db, code, userId);

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
