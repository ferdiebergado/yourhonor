import { getDb } from '@backend/db';
import { deserializeDetails } from '@backend/features/account';
import { createORS } from '@backend/features/honorarium';
import { findActiveHonorariaPerActivity } from '@backend/features/honorarium/repo';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { GenerateDocSchema, type HonorariumDetail } from '@shared/schemas/honorarium';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { code } = await parseJson(req, GenerateDocSchema);
    const db = await getDb();
    const honorariumDetailRows = await findActiveHonorariaPerActivity(db, code);

    const honoraria: HonorariumDetail[] = [];

    for (const row of honorariumDetailRows) {
      const deserialized = deserializeDetails(row.details);
      honoraria.push({ ...row, ...deserialized });
    }

    if (honoraria.length === 0) return;

    const excelBuffer = await createORS(honoraria);
    const blob = new Blob([excelBuffer]);
    const filename = `ORS-${code}.xlsx`;

    return xlsxResponse(blob, filename);
  } catch (error) {
    return respondWithError(error);
  }
};
