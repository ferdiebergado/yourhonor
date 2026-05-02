import { createActivity } from '@backend/activity/repo';
import { getDb } from '@backend/db';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityFormSchema, type CreateActivity } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const activity = await parseJson(req, ActivityFormSchema);

    const { userId } = await getSession(req);

    const data: CreateActivity = {
      ...activity,
      fundSource: 'TODO: create fund source helper',
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    const activityId = await createActivity(db, data);

    const payload: ApiResponse<typeof data & { id: number }> = {
      success: true,
      data: { id: activityId, ...data },
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
