import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generateORS } from '@server/features/honorarium';
import { xlsxResponse } from '@server/features/honorarium/utils';
import { type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { parseRouteParams } from '@server/http/parsers';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/ors'],
};

async function handler(request: AuthenticatedRequest, ctx: Context) {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const ors = await generateORS(code, request.session.userId);

  if (!ors) throw new NotFoundError('Activity not found.');

  return xlsxResponse(ors.doc, ors.filename);
}

export default withMiddlewares(handler);
