import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { createPayee } from '@backend/features/payee/repo';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { PayeeFormSchema, type NewPayee } from '@shared/schemas/payee';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
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
}

export default withErrorHandling(handler);
