import type { Database } from '@backend/db';
import { type BankItem, type NewBank } from '@shared/schemas/bank';
import type { Entity, EntityID } from '@shared/schemas/base';

export async function createBank(db: Database, bank: NewBank): Promise<Entity['id']> {
  const sql = `
INSERT INTO banks (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
  `;

  const { name, createdBy } = bank;

  const { rows } = await db.execute<EntityID>(sql, [name, createdBy, createdBy]);

  return rows[0].id;
}

export async function findActiveBanks(db: Database): Promise<BankItem[]> {
  const sql = `
SELECT id, name
FROM banks
WHERE deleted_at IS NULL
ORDER BY name
`;

  const { rows } = await db.execute<BankItem>(sql);

  return rows;
}
