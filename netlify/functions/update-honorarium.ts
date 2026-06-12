import type { Context } from '@netlify/functions';

import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { updateHonorarium } from '@backend/features/honorarium/repo';
import { checkMethod, parseJson, parseRouteParams } from '@backend/http';
import logger from '@backend/logger';
import { getSession } from '@backend/session';
import {
  HonorariumFormSchema,
  HonorariumIdSchema,
  type HonorariumUpdate,
} from '@shared/schemas/honorarium';
import type { ApiResponse } from '@shared/types';
import { computeHonorarium } from '@shared/utils';

async function handler(req: Request, ctx: Context) {
  checkMethod(req, ['PUT']);
  const { userId } = await getSession(req);

  const { id } = parseRouteParams(ctx.params, HonorariumIdSchema);

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
}

export default withErrorHandling(handler);
