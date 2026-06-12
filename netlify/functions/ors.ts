import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { generateORS } from '@backend/features/honorarium';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

async function handler(req: Request) {
  checkMethod(req, ['POST']);
  const { userId } = await getSession(req);

  const { code } = await parseJson(req, ActivityCodeSchema);

  const ors = await generateORS(code, userId);

  if (!ors) throw new NotFoundError('Activity not found.');

  return xlsxResponse(ors.doc, ors.filename);
}

export default withErrorHandling(handler);
