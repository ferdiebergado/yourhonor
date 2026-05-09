import { getDb } from '@backend/db';
import { deserializeDetails } from '@backend/features/account';
import { findActiveAccounts } from '@backend/features/account/repo';
import { checkMethod } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import type { AccountDetail } from '@shared/schemas/account';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);

    const db = await getDb();
    const accountDetailRows = await findActiveAccounts(db);

    const data: AccountDetail[] = [];

    for (const row of accountDetailRows) {
      const deserialized = deserializeDetails(row.details);
      data.push({ ...row, ...deserialized });
    }

    const payload: ApiResponse<typeof data> = {
      success: true,
      data,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
