import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { createBank } from '@backend/features/bank/repo';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { BankFormSchema, type NewBank } from '@shared/schemas/bank';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['POST']);

  const { userId } = await getSession(req);

  const data = await parseJson(req, BankFormSchema);

  const bank: NewBank = {
    ...data,
    createdBy: userId,
  };

  const id = await createBank(db, bank);

  const payload: ApiResponse<number> = {
    success: true,
    data: id,
  };

  return Response.json(payload, { status: 201 });
}

export default withErrorHandling(handler);
