import { db } from '@backend/db';
import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { updateActivity } from '@backend/features/activity/repo';
import { getFundCluster } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson, parseRouteParams } from '@backend/http';
import logger from '@backend/logger';
import { getSession } from '@backend/session';
import type { Context } from '@netlify/functions';
import {
  ActivityCodeSchema,
  ActivityFormSchema,
  type ActivityUpdate,
} from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

async function handler(req: Request, ctx: Context) {
  checkMethod(req, ['PUT']);
  const { userId } = await getSession(req);

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  logger.info({ code }, 'Updating activity...');

  const data = await parseJson(req, ActivityFormSchema);

  const activity: ActivityUpdate = {
    ...data,
    fundSource: getFundCluster(data.code),
    updatedBy: userId,
  };

  const isUpdated = await updateActivity(db, code, activity);

  if (!isUpdated) throw new NotFoundError(`Activity not found.`);

  const payload: ApiResponse = {
    success: true,
  };

  logger.info('Activity updated.');

  return Response.json(payload);
}

export default withErrorHandling(handler);
