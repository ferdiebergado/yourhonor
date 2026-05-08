import { getDb } from '@backend/db';
import { findActiveHonorariaPerActivity } from '@backend/features/honorarium/repo';
import { checkMethod, parseSearchParams } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import type { ApiResponse } from '@shared/types';
import * as z from 'zod';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const schema = z.object({
      code: z.string().min(1, 'Activity code is required.'),
    });

    const { code } = parseSearchParams(req, schema);
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
