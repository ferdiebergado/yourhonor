import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { generatePayroll } from '@backend/features/honorarium';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

async function handler(req: Request) {
  checkMethod(req, ['POST']);
  const { userId } = await getSession(req);

  const { code } = await parseJson(req, ActivityCodeSchema);

  const payroll = await generatePayroll(code, userId);

  if (!payroll) throw new NotFoundError('Activity not found.');

  return xlsxResponse(payroll.doc, payroll.filename);
}

export default withErrorHandling(handler);
