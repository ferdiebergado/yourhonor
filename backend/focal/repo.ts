import type { Client } from '@libsql/client';
import { FocalBaseSchema, type FocalBase } from '@shared/schemas/focal';
import { snakeToCamel } from '@shared/utils';

export async function findActiveFocals(db: Client): Promise<FocalBase[]> {
  const sql = `
SELECT f.id, f.firstname, f.mi, f.lastname, f.sex, f.position_id, p.name AS position
FROM focals f
LEFT JOIN positions p ON f.position_id = p.id
WHERE f.deleted_at IS NULL
ORDER BY f.firstname ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => FocalBaseSchema.parse(snakeToCamel(row)));
}
