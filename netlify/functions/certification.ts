import { generateCertification } from '@backend/features/honorarium';
import { docxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);
    const { userId } = await getSession(req);

    const { code } = await parseJson(req, ActivityCodeSchema);

    const { doc, filename } = await generateCertification(code, userId);

    return docxResponse(doc, filename);
  } catch (error) {
    return respondWithError(error);
  }
};
