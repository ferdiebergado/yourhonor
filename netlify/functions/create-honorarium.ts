import { getDb } from '@backend/db';
import { createHonorarium } from '@backend/features/honorarium/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { HonorariumFormSchema, type NewHonorarium } from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';
import { computeHonorarium } from '@shared/utils';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, HonorariumFormSchema);

    const computed = computeHonorarium(data.amount, data.salary, data.taxRate);
    const honorarium: NewHonorarium = {
      ...data,
      ...computed,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createHonorarium(db, honorarium);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
