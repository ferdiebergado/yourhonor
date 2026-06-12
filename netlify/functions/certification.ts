import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@backend/errors';
import { generateCertification } from '@backend/features/honorarium';
import { docxResponse } from '@backend/features/honorarium/utils';
import { parseRouteParams } from '@backend/http';
import { withMiddlewares, type AuthenticatedRequest } from '@backend/http/middlewares';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/certification'],
};

async function handler(req: AuthenticatedRequest, ctx: Context) {
  if (req.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  const { userId } = await getSession(req);

  const { code } = parseRouteParams(ctx.params, ActivityCodeSchema);

  const certification = await generateCertification(code, userId);

  if (!certification) throw new NotFoundError('Activity not found.');

  return docxResponse(certification.doc, certification.filename);
}

export default withMiddlewares(handler);
