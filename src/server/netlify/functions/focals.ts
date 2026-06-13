import { db } from '@server/db';
import { createFocal, findActiveFocals } from '@server/features/focal/repo';
import { type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { parseJson } from '@server/http/parsers';
import {
  FocalFormSchema,
  type FocalDetail,
  type FocalFormValues,
  type NewFocal,
} from '@shared/schemas/focal';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: FocalFormValues, userId: User['id']) {
  const focal: NewFocal = {
    ...data,
    createdBy: userId,
  };

  const id = await createFocal(db, focal);

  const payload: ApiResponse<number> = {
    success: true,
    data: id,
  };

  return Response.json(payload, { status: 201 });
}

async function listFocals() {
  const data = await findActiveFocals(db);

  const payload: ApiResponse<FocalDetail[]> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

async function handler(request: AuthenticatedRequest) {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listFocals();
    }

    case 'POST': {
      const focal = await parseJson(request, FocalFormSchema);

      return handleCreate(focal, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
}

export default withMiddlewares(handler);
