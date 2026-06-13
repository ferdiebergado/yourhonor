import type { Context } from '@netlify/functions';

import { db } from '@server/db';
import { NotFoundError } from '@server/errors';
import { createHonorarium, updateHonorarium } from '@server/features/honorarium/repo';
import { type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { parseJson, parseRouteParams } from '@server/http/parsers';
import logger from '@server/logger';
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

async function handler(request: AuthenticatedRequest, ctx: Context) {
  const userId = request.session.userId;

  switch (request.method as HttpMethod) {
    case 'POST': {
      const honorarium = await parseJson(request, HonorariumFormSchema);
      return handleCreate(honorarium, userId);
    }

    case 'PUT': {
      const { id } = parseRouteParams(ctx.params, HonorariumIdSchema);

      const data = await parseJson(request, HonorariumFormSchema);

      return handleUpdate(data, id, userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'POST, PUT' } });
    }
  }
}

export default withMiddlewares(handler);
