import type { Database } from '@server/db';
import type { Summary } from '@shared/types';

export async function getSummary(db: Database): Promise<Summary> {
  const sql = `
SELECT
  COUNT(DISTINCT activity_code) totalActivities,
  COUNT(id) totalHonoraria
FROM honoraria;
  `;

  const { rows } = await db.execute<Summary>(sql);

  return rows[0];
}
