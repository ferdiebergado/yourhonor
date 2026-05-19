import type { Client } from '@libsql/client';
import { BankBaseSchema, type BankBase, type NewBank } from '@shared/schemas/bank';

type CreateBankResultSet = {
  id: number;
};

export async function createBank(db: Client, bank: NewBank): Promise<number> {
  const sql = `
INSERT INTO banks (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
  `;

  const { name, createdBy, updatedBy } = bank;

  const { rows } = await db.execute(sql, [name, createdBy, updatedBy]);
  const { id } = rows[0] as unknown as CreateBankResultSet;

  return id;
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
