import type { Database } from '@backend/db';
import { type Bank, type BankBase, type NewBank } from '@shared/schemas/bank';
import type { IdRow } from '@shared/types';

export async function createBank(db: Database, bank: NewBank): Promise<Bank['id']> {
  const sql = `
INSERT INTO banks (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
  `;

  const { name, createdBy, updatedBy } = bank;

  const { rows } = await db.execute<IdRow>(sql, [name, createdBy, updatedBy]);

  return rows[0].id;
}

export async function findActiveBanks(db: Database): Promise<BankBase[]> {
  const sql = `
SELECT id, name
FROM banks
WHERE deleted_at IS NULL
ORDER BY name ASC
`;

  const { rows } = await db.execute<BankBase>(sql);

  return rows;
}
