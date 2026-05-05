import type { Client } from '@libsql/client';
import { BankBaseSchema, type BankBase, type CreateBank } from '@shared/schemas/bank';

export async function createBank(db: Client, bank: CreateBank): Promise<void> {
  const sql = `
INSERT INTO banks (name, created_by, updated_by)
VALUES (?, ?, ?)
  `;

  const { name, createdBy, updatedBy } = bank;

  await db.execute(sql, [name, createdBy, updatedBy]);
}

export async function findActiveBanks(db: Client): Promise<BankBase[]> {
  const sql = `
SELECT id, name
FROM banks
WHERE deleted_at IS NULL
ORDER BY name ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => BankBaseSchema.parse(row));
}
