import type { Database } from '@server/db';
import type { User } from '@shared/schemas/user';
import type { Summary } from '@shared/types';

export async function getSummary(db: Database, userId: User['id']): Promise<Summary> {
  const sql = `
SELECT
  (SELECT COUNT(id) FROM activities WHERE created_by = ?) totalActivities,
  (SELECT COUNT(id) FROM honoraria WHERE created_by = ?) totalHonoraria
  `;

  const { rows } = await db.execute<Summary>(sql, [userId, userId]);

  return rows[0];
}
