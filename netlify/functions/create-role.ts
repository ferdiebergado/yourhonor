import { getDb } from '@backend/db';
import { createRole } from '@backend/features/role/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { RoleFormSchema, type CreateRole } from '@shared/schemas/role';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const data = await parseJson(req, RoleFormSchema);

    const { userId } = await getSession(req);

    const role: CreateRole = {
      ...data,
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createRole(db, role);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
