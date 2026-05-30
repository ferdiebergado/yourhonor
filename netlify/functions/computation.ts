import { generateComputation } from '@backend/features/honorarium';
import { docxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { NotFoundError, respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);
    const { userId } = await getSession(req);

    const { code } = await parseJson(req, ActivityCodeSchema);

    const comp = await generateComputation(code, userId);

    if (!comp) throw new NotFoundError('Activity not found.');

    return docxResponse(comp.doc, comp.filename);
  } catch (error) {
    return respondWithError(error);
  }
};
