import { withErrorHandling } from '@backend/error-handler';
import { NotFoundError } from '@backend/errors';
import { generateComputation } from '@backend/features/honorarium';
import { docxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

async function handler(req: Request) {
  checkMethod(req, ['POST']);
  const { userId } = await getSession(req);

  const { code } = await parseJson(req, ActivityCodeSchema);

  const comp = await generateComputation(code, userId);

  if (!comp) throw new NotFoundError('Activity not found.');

  return docxResponse(comp.doc, comp.filename);
}

export default withErrorHandling(handler);
