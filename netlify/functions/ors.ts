import { generateORS } from '@backend/features/honorarium';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { NotFoundError, respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);
    const { userId } = await getSession(req);

    const { code } = await parseJson(req, ActivityCodeSchema);

    const ors = await generateORS(code, userId);

    if (!ors) throw new NotFoundError('Activity not found.');

    return xlsxResponse(ors.doc, ors.filename);
  } catch (error) {
    return respondWithError(error);
  }
};
