import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generateCertification } from '@server/features/honorarium';
import { docxResponse } from '@server/features/honorarium/utils';
import { parseRouteParams, type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/certification'],
};

async function handler(request: AuthenticatedRequest, context: Context) {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const { code } = parseRouteParams(context.params, ActivityCodeSchema);

  const certification = await generateCertification(code, request.session.userId);

  if (!certification) throw new NotFoundError('Activity not found.');

  return docxResponse(certification.doc, certification.filename);
}

export default withMiddlewares(handler);
