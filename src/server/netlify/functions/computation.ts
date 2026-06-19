import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generateComputation } from '@server/features/honorarium';
import { docxResponse } from '@server/features/honorarium/utils';
import { type HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import { parseRouteParams } from '@server/http/parsers';
import type { AppRequest, NetlifyFunction } from '@server/types';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/computation'],
};

const handler: NetlifyFunction = async (request: AppRequest, ctx: Context) => {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const comp = await generateComputation(code, request.session.userId);

  if (!comp) throw new NotFoundError('Activity not found.');

  return docxResponse(comp.doc, comp.filename);
};

export default withMiddlewares(handler);
