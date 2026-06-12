import type { Context } from '@netlify/functions';

import { db } from '@backend/db';
import { NotFoundError } from '@backend/errors';
import { createHonorarium, updateHonorarium } from '@backend/features/honorarium/repo';
import { parseJson, parseRouteParams, type HttpMethod } from '@backend/http';
import { withMiddlewares } from '@backend/http/middlewares';
import logger from '@backend/logger';
import { getSession } from '@backend/session';
import {
  HonorariumFormSchema,
  HonorariumIdSchema,
  type Honorarium,
  type HonorariumFormValues,
  type HonorariumUpdate,
  type NewHonorarium,
} from '@shared/schemas/honorarium';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';
import { computeHonorarium } from '@shared/utils';

async function handleCreate(data: HonorariumFormValues, userId: User['id']) {
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

async function handleUpdate(data: HonorariumFormValues, id: Honorarium['id'], userId: User['id']) {
  logger.info({ id }, 'Updating honorarium...');

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

async function handler(req: Request, ctx: Context) {
  const { userId } = await getSession(req);

  switch (req.method as HttpMethod) {
    case 'POST': {
      const honorarium = await parseJson(req, HonorariumFormSchema);
      return handleCreate(honorarium, userId);
    }

    case 'PUT': {
      const { id } = parseRouteParams(ctx.params, HonorariumIdSchema);

      const data = await parseJson(req, HonorariumFormSchema);

      return handleUpdate(data, id, userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'POST, PUT' } });
    }
  }
}

export default withMiddlewares(handler);
