import type { Client } from '@libsql/client';
import { PayeeBaseSchema, type NewPayee, type PayeeBase } from '@shared/schemas/payee';
import { snakeToCamel } from '@shared/utils';

type CreatePayeeResultSet = {
  id: number;
};

export async function createPayee(db: Client, focal: NewPayee): Promise<number> {
  const sql = `
INSERT INTO payees (firstname, mi, lastname, tin, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const { firstname, mi, lastname, tin, createdBy, updatedBy } = focal;

  const { rows } = await db.execute(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    // eslint-disable-next-line unicorn/no-null
    tin ?? null,
    createdBy,
    updatedBy,
  ]);

  const { id } = rows[0] as unknown as CreatePayeeResultSet;

  return id;
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
