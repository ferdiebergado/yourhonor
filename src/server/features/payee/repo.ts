import type { Database } from '@server/db';
import type { Entity, EntityID } from '@shared/schemas/base';
import { type NewPayee, type PayeeItem } from '@shared/schemas/payee';

export async function createPayee(db: Database, payee: NewPayee): Promise<Entity['id']> {
  const sql = `
INSERT INTO payees (firstname, mi, lastname, tin, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const { firstname, mi, lastname, tin, createdBy } = payee;

  const { rows } = await db.execute<EntityID>(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    // eslint-disable-next-line unicorn/no-null
    tin ?? null,
    createdBy,
    createdBy,
  ]);

  return rows[0].id;
}

export async function findActivePayees(db: Database): Promise<PayeeItem[]> {
  const sql = `
SELECT id, firstname, mi, lastname
FROM payees
WHERE deleted_at IS NULL
ORDER BY firstname, mi, lastname
  `;

  const { rows } = await db.execute<PayeeItem>(sql);

  return rows;
}
