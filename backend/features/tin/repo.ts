import type { Client } from '@libsql/client';
import { TinBaseSchema, type CreateTin, type TinBase } from '@shared/schemas/tin';

export async function createTIN(db: Client, role: CreateTin): Promise<void> {
  const sql = `
INSERT INTO tins (payee_id, tin, created_by, updated_by)
VALUES (?, ?, ?, ?)
  `;

  const { payeeId, tin, createdBy, updatedBy } = role;

  await db.execute(sql, [payeeId, tin, createdBy, updatedBy]);
}

export async function findActiveTINs(db: Client): Promise<TinBase[]> {
  const sql = `
SELECT id, payee_id, tin
FROM tins
WHERE deleted_at IS NULL
ORDER BY tin ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => TinBaseSchema.parse(row));
}
