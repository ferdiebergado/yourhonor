import { getDb } from '@backend/db';
import { deserializeDetails } from '@backend/features/account';
import { createORS } from '@backend/features/honorarium';
import { findActiveHonorariaByActivity, recordUsage } from '@backend/features/honorarium/repo';
import { xlsxResponse } from '@backend/features/honorarium/utils';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { getSession } from '@backend/session';
import { ActivityCodeSchema } from '@shared/schemas/activity';
import { type HonorariumDetail } from '@shared/schemas/honorarium';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);
    const { userId } = await getSession(req);

    const { code } = await parseJson(req, ActivityCodeSchema);
    const db = await getDb();
    const honorariumDetailRows = await findActiveHonorariaByActivity(db, code);

    const honoraria: HonorariumDetail[] = [];

    for (const row of honorariumDetailRows) {
      const accountDetails = deserializeDetails(row.details);
      honoraria.push({ ...row, ...accountDetails });
    }

    if (honoraria.length === 0) return;

    const excelBuffer = await createORS(honoraria);

    await recordUsage(db, 'ORS-DV', userId);

    const blob = new Blob([excelBuffer]);
    const filename = `ORS-${code}.xlsx`;

    return xlsxResponse(blob, filename);
  } catch (error) {
    return respondWithError(error);
  }
};
