import { getDb } from '@backend/db';
import { createPayee } from '@backend/features/payee/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { PayeeFormSchema, type CreatePayee } from '@shared/schemas/payee';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, PayeeFormSchema);

    const { userId } = await getSession(req);

    const payee: CreatePayee = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createPayee(db, payee);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
