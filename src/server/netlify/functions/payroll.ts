import type { Config, Context } from '@netlify/functions';

import { NotFoundError } from '@server/errors';
import { generatePayroll } from '@server/features/activity/payroll-service';
import { xlsxResponse } from '@server/features/honorarium/utils';
import { type HttpMethod } from '@server/http';
import { withMiddlewares } from '@server/http/middlewares';
import { parseRouteParams } from '@server/http/parsers';
import type { AppRequest, NetlifyFunction } from '@server/types';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/payroll'],
};

const handler: NetlifyFunction = async (request: AppRequest, context: Context) => {
  const allowedMethod: HttpMethod = 'POST';

  if (request.method !== allowedMethod)
    return new Response(undefined, { status: 405, headers: { Allow: allowedMethod } });

  const { code } = parseRouteParams(context.params, ActivityCodeSchema);

  const payroll = await generatePayroll(code, request.session.userId);

  if (!payroll) throw new NotFoundError('Activity not found.');

  return xlsxResponse(payroll.doc, payroll.filename);
};

export default withMiddlewares(handler);
