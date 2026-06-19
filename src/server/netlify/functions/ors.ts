import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generateORS } from '@server/features/activity/ors';
import { xlsxResponse } from '@server/features/honorarium/utils';
import { type HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import { parseRouteParams } from '@server/http/parsers';
import type { AppRequest, NetlifyFunction } from '@server/types';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/ors'],
};

const handler: NetlifyFunction = async (request: AppRequest, ctx: Context) => {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const ors = await generateORS(code, request.session.userId);

  if (!ors) throw new NotFoundError('Activity not found.');

  return xlsxResponse(ors.doc, ors.filename);
};

export default withMiddlewares(handler);
