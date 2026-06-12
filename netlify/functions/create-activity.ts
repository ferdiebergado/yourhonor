import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { createActivity, findActiveActivityByUser } from '@backend/features/activity/repo';
import { getFundCluster } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { ActivityFormSchema, type NewActivity } from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request) {
  checkMethod(req, ['POST']);
  const { userId } = await getSession(req);

  const data = await parseJson(req, ActivityFormSchema);

  const newActivity: NewActivity = {
    ...data,
    fundSource: getFundCluster(data.code),
    createdBy: userId,
  };

  await createActivity(db, newActivity);

  const activity = await findActiveActivityByUser(db, data.code, userId);
  if (!activity) throw new NotFoundError('Activity not found.');

  const payload: ApiResponse<typeof activity> = {
    success: true,
    data: activity,
  };

  return Response.json(payload, { status: 201 });
}

export default withErrorHandling(handler);
