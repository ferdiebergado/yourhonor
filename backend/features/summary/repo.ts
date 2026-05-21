import type { Database } from '@backend/db';
import { type Summary } from '@shared/schemas/summary';

export async function getSummary(db: Database): Promise<Summary | undefined> {
  const sql = `
SELECT
  COUNT(DISTINCT activity_code) totalActivities,
  COUNT(id) totalHonoraria
FROM honoraria;
  `;

  const { rows } = await db.execute<Summary>(sql);

  return rows[0];
}
