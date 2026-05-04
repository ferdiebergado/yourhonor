import type { Client } from '@libsql/client';
import { PayeeBaseSchema, type CreatePayee, type PayeeBase } from '@shared/schemas/payee';
import { snakeToCamel } from '@shared/utils';

export async function createPayee(db: Client, focal: CreatePayee): Promise<void> {
  const sql = `
INSERT INTO payees (firstname, mi, lastname, created_by, updated_by)
VALUES (?, ?, ?, ?, ?)
`;

  const { firstname, mi, lastname, createdBy, updatedBy } = focal;

  await db.execute(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    createdBy,
    updatedBy,
  ]);
}

export async function findActivePayees(db: Client): Promise<PayeeBase[]> {
  const sql = `
SELECT id, firstname, mi, lastname
FROM payees
WHERE deleted_at IS NULL
ORDER BY firstname ASC
  `;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => PayeeBaseSchema.parse(snakeToCamel(row)));
}
