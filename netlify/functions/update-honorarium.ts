import { db } from '@backend/db';
import { updateHonorarium } from '@backend/features/honorarium/repo';
import { checkMethod, parseJson, parseSearchParams } from '@backend/http';
import { NotFoundError, respondWithError } from '@backend/http/errors';
import logger from '@backend/logger';
import { getSession } from '@backend/session';
import {
  HonorariumFormSchema,
  HonorariumIdSchema,
  type HonorariumUpdate,
} from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';
import { computeHonorarium } from '@shared/utils';

export default async (req: Request) => {
  try {
    checkMethod(req, ['PUT']);
    const { userId } = await getSession(req);

    const { id } = parseSearchParams(req, HonorariumIdSchema);

    logger.info({ id }, 'Updating honorarium...');

    const data = await parseJson(req, HonorariumFormSchema);

    const computed = computeHonorarium(data.amount, data.salary, data.taxRate);

    const honorarium: HonorariumUpdate = {
      ...data,
      ...computed,
      updatedBy: userId,
    };

    const isUpdated = await updateHonorarium(db, id, honorarium);

    if (!isUpdated) throw new NotFoundError('Honorarium not found.');

    const payload: ApiResponse = {
      success: true,
    };

    logger.info('Honorarium updated.');

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
