import { db } from '@backend/db';
import { createPosition } from '@backend/features/position/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { PositionFormSchema, type NewPosition } from '@shared/schemas/position';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, PositionFormSchema);

    const position: NewPosition = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const id = await createPosition(db, position);

    const payload: ApiResponse<number> = {
      success: true,
      data: id,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
