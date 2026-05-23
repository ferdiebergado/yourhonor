import { db } from '@backend/db';
import { updateActivity } from '@backend/features/activity/repo';
import { getFundCluster } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson, parseSearchParams } from '@backend/http';
import { NotFoundError, respondWithError } from '@backend/http/errors';
import logger from '@backend/logger';
import { getSession } from '@backend/session';
import {
  ActivityCodeSchema,
  ActivityFormSchema,
  type ActivityUpdate,
} from '@shared/schemas/activity';
import type { ApiResponse } from '@shared/types';

export default async (req: Request) => {
  try {
    checkMethod(req, ['PUT']);
    const { userId } = await getSession(req);

    const { code } = parseSearchParams(req, ActivityCodeSchema);

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
  } catch (error) {
    return respondWithError(error);
  }
};
