import { db } from '@backend/db';
import { createPayee, findActivePayees } from '@backend/features/payee/repo';
import { parseJson, type HttpMethod } from '@backend/http';
import { withMiddlewares, type AuthenticatedRequest } from '@backend/http/middlewares';
import {
  PayeeFormSchema,
  type NewPayee,
  type PayeeFormValues,
  type PayeeItem,
} from '@shared/schemas/payee';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: PayeeFormValues, userId: User['id']) {
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

async function listPayees() {
  const data = await findActivePayees(db);

  const payload: ApiResponse<PayeeItem[]> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

async function handler(request: AuthenticatedRequest) {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listPayees();
    }

    case 'POST': {
      const payee = await parseJson(request, PayeeFormSchema);

      return handleCreate(payee, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
}

export default withMiddlewares(handler);
