import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { createHonorarium } from '@backend/features/honorarium/repo';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { HonorariumFormSchema, type NewHonorarium } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';
import { computeHonorarium } from '@shared/utils';

async function handler(req: Request) {
  checkMethod(req, ['POST']);

  const { userId } = await getSession(req);

  const data = await parseJson(req, HonorariumFormSchema);

  const computed = computeHonorarium(data.amount, data.salary, data.taxRate);
  const honorarium: NewHonorarium = {
    ...data,
    ...computed,
    createdBy: userId,
  };

  await createHonorarium(db, honorarium);

  const payload: ApiResponse = {
    success: true,
  };

  return Response.json(payload, { status: 201 });
}

export default withErrorHandling(handler);
