import { getDb } from '@backend/db';
import { findActiveActivityDetailedByUser } from '@backend/features/activity/repo';
import { checkMethod, parseSearchParams } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import type { ApiResponse } from '@shared/types';
import * as z from 'zod';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const schema = z.object({
      id: z.coerce.number().positive(),
    });

    const { id } = parseSearchParams(req, schema);

    const { userId } = await getSession(req);
    const db = await getDb();
    const data = await findActiveActivityDetailedByUser(db, id, userId);

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
