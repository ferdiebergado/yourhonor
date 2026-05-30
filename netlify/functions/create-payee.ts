import { db } from '@backend/db';
import { createPayee } from '@backend/features/payee/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { PayeeFormSchema, type NewPayee } from '@shared/schemas/payee';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, PayeeFormSchema);

    const payee: NewPayee = {
      ...data,
      createdBy: userId,
    };

    const id = await createPayee(db, payee);

    const payload: ApiResponse<number> = {
      success: true,
      data: id,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
