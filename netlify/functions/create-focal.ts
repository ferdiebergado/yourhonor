import { db } from '@backend/db';
import { createFocal } from '@backend/features/focal/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { FocalFormSchema, type NewFocal } from '@shared/schemas/focal';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, FocalFormSchema);

    const focal: NewFocal = {
      ...data,
      createdBy: userId,
    };

    const id = await createFocal(db, focal);

    const payload: ApiResponse<number> = {
      success: true,
      data: id,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
