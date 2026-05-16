import { getDb } from '@backend/db';
import { deserializeDetails } from '@backend/features/account';
import { createPayroll } from '@backend/features/honorarium';
import { findActiveHonorariaPerActivity, recordUsage } from '@backend/features/honorarium/repo';
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
    const honorariumDetailRows = await findActiveHonorariaPerActivity(db, code);

    const honoraria: HonorariumDetail[] = [];

    for (const row of honorariumDetailRows) {
      const deserialized = deserializeDetails(row.details);
      honoraria.push({ ...row, ...deserialized });
    }

    if (honoraria.length === 0) return;

    const excelBuffer = await createPayroll(honoraria);

    await recordUsage(db, 'Payroll', userId);

    const blob = new Blob([excelBuffer]);
    const filename = `Payroll-${code}.xlsx`;

    return xlsxResponse(blob, filename);
  } catch (error) {
    return respondWithError(error);
  }
};
