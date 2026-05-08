import type { Client } from '@libsql/client';
import type { NewHonorarium } from '@shared/schemas/honorarium';

export async function createHonorarium(db: Client, honorarium: NewHonorarium): Promise<void> {
  const sql = `
INSERT INTO honoraria (activity_code, payee_id, role_id, amount, hours_rendered, actual, net, account_id, tax_rate, salary, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const {
    activityCode,
    payeeId,
    roleId,
    amount,
    hoursRendered,
    actual,
    net,
    accountId,
    taxRate,
    salary,
    createdBy,
    updatedBy,
  } = honorarium;

  await db.execute(sql, [
    activityCode,
    payeeId,
    roleId,
    amount,
    hoursRendered,
    actual,
    net,
    accountId,
    taxRate,
    salary,
    createdBy,
    updatedBy,
  ]);
}
