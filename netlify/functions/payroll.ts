import { getDb } from '@backend/db';
import { createPayroll } from '@backend/features/honorarium';
import { findActiveHonorariaPerActivity } from '@backend/features/honorarium/repo';
import { checkMethod, parseJson } from '@backend/http';
import { respondWithError } from '@backend/http/errors';
import { GenerateDocSchema } from '@shared/schemas/honorarium';

export default async (req: Request) => {
  try {
    checkMethod(req, ['POST']);

    const { code } = await parseJson(req, GenerateDocSchema);
    const db = await getDb();
    const honoraria = await findActiveHonorariaPerActivity(db, code);

    if (honoraria.length === 0) return;

    const excelBuffer = await createPayroll(honoraria);
    const blob = new Blob([excelBuffer]);
    const filename = `Payroll-${code}.xlsx`;

    return new Response(blob, {
      status: 200,
      headers: {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=${filename}`,
      },
    });
  } catch (error) {
    return respondWithError(error);
  }
};
