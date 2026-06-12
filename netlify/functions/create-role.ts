import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { createRole } from '@backend/features/role/repo';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { RoleFormSchema, type NewRole } from '@shared/schemas/role';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['POST']);

  const { userId } = await getSession(req);

  const data = await parseJson(req, RoleFormSchema);

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

export default withErrorHandling(handler);
