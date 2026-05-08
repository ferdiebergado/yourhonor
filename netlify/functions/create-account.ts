import { getDb } from '@backend/db';
import { createAccount } from '@backend/features/account/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { AccountFormSchema, type NewAccountRow } from '@shared/schemas/account';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, AccountFormSchema);

    const { userId } = await getSession(req);

    const account: NewAccountRow = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createAccount(db, account);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
