import { getDb } from '@backend/db';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { createPosition } from '@backend/position/repo';
import { getSession } from '@backend/session';
import { PositionFormSchema, type CreatePosition, type Position } from '@shared/schemas/position';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, PositionFormSchema);

    const { userId } = await getSession(req);

    const position: CreatePosition = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    const created = await createPosition(db, position);

    const payload: ApiResponse<Position> = {
      success: true,
      data: created,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
