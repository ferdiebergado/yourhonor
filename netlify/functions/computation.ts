import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@backend/errors';
import { generateComputation } from '@backend/features/honorarium';
import { docxResponse } from '@backend/features/honorarium/utils';
import { parseRouteParams } from '@backend/http';
import { withMiddlewares } from '@backend/http/middlewares';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/computation'],
};

async function handler(req: Request, ctx: Context) {
  if (req.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  const { userId } = await getSession(req);

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const comp = await generateComputation(code, userId);

  if (!comp) throw new NotFoundError('Activity not found.');

  return docxResponse(comp.doc, comp.filename);
}

export default withMiddlewares(handler);
