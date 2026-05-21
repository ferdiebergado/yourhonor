import type { Database } from '@backend/db';
import { type NewPayee, type Payee, type PayeeBase } from '@shared/schemas/payee';
import type { IdRow } from '@shared/types';

export async function createPayee(db: Database, focal: NewPayee): Promise<Payee['id']> {
  const sql = `
INSERT INTO payees (firstname, mi, lastname, tin, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const { firstname, mi, lastname, tin, createdBy, updatedBy } = focal;

  const { rows } = await db.execute<IdRow>(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    // eslint-disable-next-line unicorn/no-null
    tin ?? null,
    createdBy,
    updatedBy,
  ]);

  return rows[0].id;
}

export async function findActivePayees(db: Database): Promise<PayeeBase[]> {
  const sql = `
SELECT id, firstname, mi, lastname
FROM payees
WHERE deleted_at IS NULL
ORDER BY firstname ASC
  `;

  const { rows } = await db.execute<PayeeBase>(sql);

  return rows;
}
