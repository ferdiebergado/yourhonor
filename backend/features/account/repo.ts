import type { Database } from '@backend/db';
import { type Account, type AccountDetailRow, type NewAccount } from '@shared/schemas/account';
import type { IdRow } from '@shared/types';

export async function findActiveAccounts(db: Database): Promise<AccountDetailRow[]> {
  const sql = `
SELECT a.id id, a.details details, a.payee_id payeeId, a.bank_id bankId, p.firstname firstname, p.mi mi, p.lastname lastname, b.name bank
FROM accounts a
LEFT JOIN payees p ON p.id = a.payee_id
LEFT JOIN banks b ON b.id = a.bank_id
WHERE a.deleted_at IS NULL
`;

  const { rows } = await db.execute<AccountDetailRow>(sql);

  return rows;
}

export async function createAccount(db: Database, account: NewAccount): Promise<Account['id']> {
  const sql = `
INSERT INTO accounts (payee_id, bank_id, details, created_by, updated_by)
VALUES (?, ?, ?, ?, ?)
RETURNING id
`;

  const { payeeId, bankId, details, createdBy, updatedBy } = account;
  const { rows } = await db.execute<IdRow>(sql, [payeeId, bankId, details, createdBy, updatedBy]);

  return rows[0].id;
}
