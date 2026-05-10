import { getDb } from '@backend/db';
import { createActivity } from '@backend/features/activity/repo';
import { getFundCluster } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityFormSchema, type CreateActivity } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const activity = await parseJson(req, ActivityFormSchema);

    const data: CreateActivity = {
      ...activity,
      fundSource: getFundCluster(activity.code),
      createdBy: userId,
      updatedBy: userId,
    };

    const db = await getDb();
    await createActivity(db, data);

    const payload: ApiResponse = {
      success: true,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
