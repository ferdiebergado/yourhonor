import { db } from '@backend/db';
import { findActiveHonorariaByActivity } from '@backend/features/honorarium/repo';
import { checkMethod, parseSearchParams } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);
    await getSession(req);

    const { code } = parseSearchParams(req, ActivityCodeSchema);
    const data = await findActiveHonorariaByActivity(db, code);

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
