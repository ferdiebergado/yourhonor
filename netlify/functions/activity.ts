import { db } from '@backend/db';
import { findActiveActivityDetailByUser } from '@backend/features/activity/repo';
import { findActiveHonorariaByActivity } from '@backend/features/honorarium/repo';
import { checkMethod, parseSearchParams } from '@backend/http';
import { NotFoundError, respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema, type ActivityWithHonoraria } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['GET']);
    const { userId } = await getSession(req);

    const { code } = parseSearchParams(req, ActivityCodeSchema);

    const activity = await findActiveActivityDetailByUser(db, code, userId);
    if (!activity) throw new NotFoundError('Activity not found.');

    const honoraria = await findActiveHonorariaByActivity(db, code, userId);

    const activityDetail: ActivityWithHonoraria = {
      ...activity,
      honoraria,
    };

    const payload: ApiResponse<typeof activityDetail> = {
      success: true,
      data: activityDetail,
    };

    return Response.json(payload);
  } catch (error) {
    return respondWithError(error);
  }
};
