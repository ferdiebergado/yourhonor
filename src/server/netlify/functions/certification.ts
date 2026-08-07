import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generateCertification } from '@server/features/honorarium/certification-service';
import { type HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import { parseRouteParams } from '@server/http/parsers';
import type { AppRequest, NetlifyFunction } from '@server/types';
import { createFileResponse } from '@server/utils';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/certification'],
};

const handler: NetlifyFunction = async (
  request: AppRequest,
  context: Context,
) => {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, {
      status: 405,
      headers: { Allow: allowedMethod },
    });

  const { code } = parseRouteParams(context.params, ActivityCodeSchema);

  const certification = await generateCertification(
    code,
    request.session.userId,
  );

  if (!certification) throw new NotFoundError('Activity not found.');

  return createFileResponse(certification.doc, 'docx', certification.filename);
};

export default withMiddlewares(handler);
