import type { Config, Context } from '@netlify/functions';

import { db } from '@server/db';
import { NotFoundError } from '@server/errors';
import {
  createActivity,
  findActiveActivitiesByUser,
  findActiveActivityByUser,
  findActiveActivityDetailByUser,
  updateActivity,
} from '@server/features/activity/repo';
import { findActiveHonorariaByActivity } from '@server/features/honorarium/repo';
import { getFundCluster } from '@server/features/honorarium/utils';
import { type HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import { parseJson, parseRouteParams } from '@server/http/parsers';
import logger from '@server/logger';
import type { AppRequest, NetlifyFunction } from '@server/types';
import {
  ActivityCodeSchema,
  ActivityFormSchema,
  type Activity,
  type ActivityFormValues,
  type ActivityInfo,
  type ActivityUpdate,
  type ActivityWithHonoraria,
  type NewActivity,
} from '@shared/schemas/activity';
import type { User } from '@shared/schemas/user';
import type { ApiResponse } from '@shared/types';

export const config: Config = {
  path: ['/api/activities', '/api/activities/:code'],
};

const handler: NetlifyFunction = async (request: AppRequest, context: Context) => {
  const userId = request.session.userId;

  switch (request.method as HttpMethod) {
    case 'GET': {
      if (!context.params.code) return listActivities(userId);

      const { code } = parseRouteParams(context.params, ActivityCodeSchema);
      return getActivity(code, userId);
    }

    case 'POST': {
      const activity = await parseJson(request, ActivityFormSchema);
      return handleCreate(activity, userId);
    }

    case 'PUT': {
      const { code } = parseRouteParams(context.params, ActivityCodeSchema);

      logger.info({ code }, 'Updating activity...');

      const activity = await parseJson(request, ActivityFormSchema);
      return handleUpdate(code, activity, userId);
    }

    default: {
      return new Response(undefined, { status: 405, headers: { Allowed: 'GET, POST, PUT' } });
    }
  }
};

async function handleCreate(data: ActivityFormValues, userId: User['id']) {
  const newActivity: NewActivity = {
    ...data,
    fundSource: getFundCluster(data.code),
    createdBy: userId,
  };

  await createActivity(db, newActivity);

  const activity = await findActiveActivityByUser(db, data.code, userId);
  if (!activity) throw new NotFoundError('Activity not found.');

  const payload: ApiResponse<ActivityInfo> = {
    success: true,
    data: activity,
  };

  return Response.json(payload, { status: 201 });
}

async function listActivities(userId: User['id']) {
  const activities = await findActiveActivitiesByUser(db, userId);

  const payload: ApiResponse<ActivityInfo[]> = {
    success: true,
    data: activities,
  };

  return Response.json(payload);
}

async function getActivity(code: Activity['code'], userId: User['id']) {
  const activity = await findActiveActivityDetailByUser(db, code, userId);
  if (!activity) throw new NotFoundError('Activity not found.');

  const honoraria = await findActiveHonorariaByActivity(db, code, userId);

  const activityDetail: ActivityWithHonoraria = {
    ...activity,
    honoraria,
  };

  const payload: ApiResponse<ActivityWithHonoraria> = {
    success: true,
    data: activityDetail,
  };

  return Response.json(payload);
}

async function handleUpdate(code: string, data: ActivityFormValues, userId: User['id']) {
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

export default withMiddlewares(handler);
