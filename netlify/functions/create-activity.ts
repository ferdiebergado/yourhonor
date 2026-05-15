import { getDb } from '@backend/db';
import { createActivity, findActiveActivityByUser } from '@backend/features/activity/repo';
import { getFundCluster } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import {
  ActivityFormSchema,
  type ActivityDetail,
  type NewActivity,
} from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { userId } = await getSession(req);

    const data = await parseJson(req, ActivityFormSchema);

    const newActivity: NewActivity = {
      ...data,
      fundSource: getFundCluster(data.code),
      createdBy: userId,
    };

    const db = await getDb();
    await createActivity(db, newActivity);

    const activity = await findActiveActivityByUser(db, data.code, userId);

    const payload: ApiResponse<ActivityDetail> = {
      success: true,
      data: activity,
    };

    return Response.json(payload, { status: 201 });
  } catch (error) {
    return respondWithError(error);
  }
};
