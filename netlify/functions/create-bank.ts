import { db } from '@backend/db';
import { createBank } from '@backend/features/bank/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { BankFormSchema, type NewBank } from '@shared/schemas/bank';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, BankFormSchema);

    const bank: NewBank = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const id = await createBank(db, bank);

    const payload: ApiResponse<number> = {
      success: true,
      data: id,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
