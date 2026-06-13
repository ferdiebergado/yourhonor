import { db } from '@server/db';
import { createRole, findActiveRoles } from '@server/features/role/repo';
import { parseJson, type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import {
  RoleFormSchema,
  type NewRole,
  type RoleFormValues,
  type RoleItem,
} from '@shared/schemas/role';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

async function handleCreate(data: RoleFormValues, userId: User['id']) {
  const role: NewRole = {
    ...data,
    createdBy: userId,
  };

  const id = await createRole(db, role);

  const payload: ApiResponse<number> = {
    success: true,
    data: id,
  };

  return Response.json(payload, { status: 201 });
}

async function listRoles() {
  const data = await findActiveRoles(db);

  const payload: ApiResponse<RoleItem[]> = {
    success: true,
    data,
  };

  return Response.json(payload);
}

async function handler(request: AuthenticatedRequest) {
  switch (request.method as HttpMethod) {
    case 'GET': {
      return listRoles();
    }

    case 'POST': {
      const role = await parseJson(request, RoleFormSchema);

      return handleCreate(role, request.session.userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST' } });
    }
  }
}

export default withMiddlewares(handler);
