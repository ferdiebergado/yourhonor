import type { Config } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generatePayroll } from '@server/features/honorarium';
import { xlsxResponse } from '@server/features/honorarium/utils';
import { type HttpMethod } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { parseJson } from '@server/http/parsers';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/payroll'],
};

async function handler(request: AuthenticatedRequest) {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const { code } = await parseJson(request, ActivityCodeSchema);

  const payroll = await generatePayroll(code, request.session.userId);

  if (!payroll) throw new NotFoundError('Activity not found.');

  return xlsxResponse(payroll.doc, payroll.filename);
}

export default withMiddlewares(handler);
