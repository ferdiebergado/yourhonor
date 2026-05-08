import { getDb } from '@backend/db';
import { genComp } from '@backend/features/honorarium';
import { findActiveHonorariaPerActivity } from '@backend/features/honorarium/repo';
import { docxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { GenerateDocSchema } from '@shared/schemas/honorarium';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { code } = await parseJson(req, GenerateDocSchema);
    const db = await getDb();
    const honoraria = await findActiveHonorariaPerActivity(db, code);

    const { doc, filename } = await genComp(honoraria);
    return docxResponse(doc, filename);
  } catch (error) {
    return respondWithError(error);
  }
};
