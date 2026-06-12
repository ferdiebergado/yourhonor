import { db } from '@backend/db';
import { createPosition, findActivePositions } from '@backend/features/position/repo';
import { parseJson, type HttpMethod } from '@backend/http';
import { withMiddlewares, type AuthenticatedRequest } from '@backend/http/middlewares';
import {
  PositionFormSchema,
  type NewPosition,
  type PositionFormValues,
  type PositionItem,
} from '@shared/schemas/position';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: PositionFormValues, userId: User['id']) {
  const position: NewPosition = {
    ...data,
    createdBy: userId,
  };

  const id = await createPosition(db, position);

  const payload: ApiResponse<number> = {
    success: true,
    data: id,
  };

  return Response.json(payload, { status: 201 });
}

async function listPositions() {
  const data = await findActivePositions(db);

  const payload: ApiResponse<PositionItem[]> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

async function handler(request: AuthenticatedRequest) {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listPositions();
    }

    case 'POST': {
      const position = await parseJson(request, PositionFormSchema);

      return handleCreate(position, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
}

export default withMiddlewares(handler);
