import type { Database } from '@server/db';
import { type AccountDetail, type NewAccount } from '@shared/schemas/account';
import type { Entity, EntityID } from '@shared/schemas/base';

export async function findActiveAccounts(db: Database): Promise<AccountDetail[]> {
  const sql = `
SELECT a.id id, a.payee_id payeeId, a.bank_id bankId, a.bank_branch bankBranch, a.account_no_last4 accountNoLast4, a.account_no_masked accountNoMasked, p.firstname firstname, p.mi mi, p.lastname lastname, b.name bank
FROM accounts a
LEFT JOIN payees p ON p.id = a.payee_id
LEFT JOIN banks b ON b.id = a.bank_id
WHERE a.deleted_at IS NULL
ORDER BY accountNoLast4
`;

  const { rows } = await db.execute<AccountDetail>(sql);

  return rows;
}

export async function createAccount(db: Database, account: NewAccount): Promise<Entity['id']> {
  const sql = `
INSERT INTO accounts (payee_id, bank_id, bank_branch, account_name, account_no, account_no_last4, account_no_masked, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const {
    payeeId,
    bankId,
    bankBranch,
    accountNo,
    accountName,
    accountNoLast4,
    accountNoMasked,
    createdBy,
  } = account;

  const { rows } = await db.execute<EntityID>(sql, [
    payeeId,
    bankId,
    bankBranch,
    accountName,
    accountNo,
    accountNoLast4,
    accountNoMasked,
    createdBy,
    createdBy,
  ]);

  return rows[0].id;
}
