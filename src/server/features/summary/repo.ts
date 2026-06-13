import type { Database } from '@server/db';

export type Summary = {
  totalActivities: number;
  totalHonoraria: number;
};

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
