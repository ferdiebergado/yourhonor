import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generateComputation } from '@server/features/honorarium';
import { docxResponse } from '@server/features/honorarium/utils';
import { parseRouteParams } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/computation'],
};

async function handler(request: AuthenticatedRequest, ctx: Context) {
  if (request.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const comp = await generateComputation(code, request.session.userId);

  if (!comp) throw new NotFoundError('Activity not found.');

  return docxResponse(comp.doc, comp.filename);
}

export default withMiddlewares(handler);
