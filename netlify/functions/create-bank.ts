import { getDb } from '@backend/db';
import { createBank } from '@backend/features/bank/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { BankFormSchema, type CreateBank } from '@shared/schemas/bank';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, BankFormSchema);

    const { userId } = await getSession(req);

    const bank: CreateBank = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createBank(db, bank);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
