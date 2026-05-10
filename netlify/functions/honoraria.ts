import { getDb } from '@backend/db';
import { findActiveHonorariaPerActivity } from '@backend/features/honorarium/repo';
import { checkMethod, parseSearchParams } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { GenerateDocSchema } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);
    await getSession(req);

    const { code } = parseSearchParams(req, GenerateDocSchema);
    const db = await getDb();
    const data = await findActiveHonorariaPerActivity(db, code);

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
