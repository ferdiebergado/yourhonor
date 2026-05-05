import { getDb } from '@backend/db';
import { createFocal } from '@backend/features/focal/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { FocalFormSchema, type CreateFocal } from '@shared/schemas/focal';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, FocalFormSchema);

    const { userId } = await getSession(req);

    const focal: CreateFocal = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createFocal(db, focal);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
