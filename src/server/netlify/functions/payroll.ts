import type { Config } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generatePayroll } from '@server/features/honorarium';
import { xlsxResponse } from '@server/features/honorarium/utils';
import { parseJson } from '@server/http';
import { withMiddlewares, type AuthenticatedRequest } from '@server/http/middlewares';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/payroll'],
};

async function handler(request: AuthenticatedRequest) {
  if (request.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  const { code } = await parseJson(request, ActivityCodeSchema);

  const payroll = await generatePayroll(code, request.session.userId);

  if (!payroll) throw new NotFoundError('Activity not found.');

  return xlsxResponse(payroll.doc, payroll.filename);
}

export default withMiddlewares(handler);
