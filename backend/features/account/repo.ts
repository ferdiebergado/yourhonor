import type { Client } from '@libsql/client';
import {
  AccountDetailSchema,
  type AccountDetail,
  type NewAccountRow,
} from '@shared/schemas/account';
import { snakeToCamel } from '@shared/utils';

export async function findActiveAccounts(db: Client): Promise<AccountDetail[]> {
  const sql = `
SELECT a.id id, a.branch branch, a.account_number account_number, a.payee_id payee_id, a.bank_id bank_id, p.firstname firstname, p.mi mi, p.lastname lastname, b.name bank
FROM accounts a
LEFT JOIN payees p ON p.id = a.payee_id
LEFT JOIN banks b ON b.id = a.bank_id
WHERE a.deleted_at IS NULL
ORDER BY a.account_number ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => AccountDetailSchema.parse(snakeToCamel(row)));
}

export async function createAccount(db: Client, account: NewAccountRow): Promise<void> {
  const sql = `
INSERT INTO accounts (payee_id, bank_id, branch, account_number, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?)
`;

  const { payeeId, bankId, branch, accountNumber, createdBy, updatedBy } = account;

  await db.execute(sql, [payeeId, bankId, branch, accountNumber, createdBy, updatedBy]);
}
