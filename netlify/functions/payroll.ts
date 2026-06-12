import type { Config } from '@netlify/functions';

import { NotFoundError } from '@backend/errors';
import { generatePayroll } from '@backend/features/honorarium';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { parseJson } from '@backend/http';
import { withMiddlewares } from '@backend/http/middlewares';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export const config: Config = {
  path: ['/api/activities/:code/payroll'],
};

async function handler(req: Request) {
  if (req.method !== 'POST')
    return new Response(undefined, { status: 405, headers: { Allow: 'POST' } });

  const { userId } = await getSession(req);

  const { code } = await parseJson(req, ActivityCodeSchema);

  const payroll = await generatePayroll(code, userId);

  if (!payroll) throw new NotFoundError('Activity not found.');

  return xlsxResponse(payroll.doc, payroll.filename);
}

export default withMiddlewares(handler);
