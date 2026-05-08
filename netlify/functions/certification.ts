import * as z from 'zod';

import { getDb } from '@backend/db';
import { generateCertification } from '@backend/features/honorarium';
import { findActiveHonorariaPerActivity } from '@backend/features/honorarium/repo';
import { docxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const schema = z.object({
      code: z.string().min(1, 'Activity code is required.'),
    });

    const { code } = await parseJson(req, schema);
    const db = await getDb();
    const honoraria = await findActiveHonorariaPerActivity(db, code);

    const { doc, filename } = await generateCertification(honoraria);
    return docxResponse(doc, filename);
  } catch (error) {
    return respondWithError(error);
  }
};
