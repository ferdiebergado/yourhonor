import type { Config, Context } from '@netlify/functions';

import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { findActiveActivityDetailByUser } from '@backend/features/activity/repo';
import { findActiveHonorariaByActivity } from '@backend/features/honorarium/repo';
import { parseRouteParams } from '@backend/http';
import { getSession } from '@backend/session';
import { ActivityCodeSchema, type ActivityWithHonoraria } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export const config: Config = {
  method: ['GET'],
  path: ['/api/activities/:code'],
};

async function handler(req: Request, ctx: Context) {
  // checkMethod(req, ['GET']);
  const { userId } = await getSession(req);

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

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
}

export default withErrorHandling(handler);
