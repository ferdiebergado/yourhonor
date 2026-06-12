import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@backend/errors';
import { generateORS } from '@backend/features/honorarium';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { parseRouteParams } from '@backend/http';
import { withMiddlewares } from '@backend/http/middlewares';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/ors'],
};

async function handler(req: Request, ctx: Context) {
  if (req.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  const { userId } = await getSession(req);

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const ors = await generateORS(code, userId);

  if (!ors) throw new NotFoundError('Activity not found.');

  return xlsxResponse(ors.doc, ors.filename);
}

export default withMiddlewares(handler);
