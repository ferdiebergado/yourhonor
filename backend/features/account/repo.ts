import type { Client } from '@libsql/client';
import {
  AccountDetailRowSchema,
  type AccountDetailRow,
  type NewAccountRow,
} from '@shared/schemas/account';
import { snakeToCamel } from '@shared/utils';

export async function findActiveAccounts(db: Client): Promise<AccountDetailRow[]> {
  const sql = `
SELECT a.id id, a.details details, a.payee_id payee_id, a.bank_id bank_id, p.firstname firstname, p.mi mi, p.lastname lastname, b.name bank
FROM accounts a
LEFT JOIN payees p ON p.id = a.payee_id
LEFT JOIN banks b ON b.id = a.bank_id
WHERE a.deleted_at IS NULL
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => AccountDetailRowSchema.parse(snakeToCamel(row)));
}

type CreateAccountResultSet = {
  id: number;
};

export async function createAccount(db: Client, account: NewAccountRow): Promise<number> {
  const sql = `
INSERT INTO accounts (payee_id, bank_id, details, created_by, updated_by)
VALUES (?, ?, ?, ?, ?)
RETURNING id
`;

  const { payeeId, bankId, details, createdBy, updatedBy } = account;

  const { rows } = await db.execute(sql, [payeeId, bankId, details, createdBy, updatedBy]);
  const { id } = rows[0] as unknown as CreateAccountResultSet;

  return id;
}
