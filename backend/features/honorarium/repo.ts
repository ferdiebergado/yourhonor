import type { Client } from '@libsql/client';
import type { CreateHonorarium } from '@shared/schemas/honorarium';

export async function createHonorarium(db: Client, honorarium: CreateHonorarium): Promise<void> {
  const sql = `
INSERT INTO honoraria (activity_id, payee_id, role_id, amount, hours_rendered, actual, net, account_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`;

  const { activityId, payeeId, roleId, amount, hoursRendered, actual, net, accountId } = honorarium;

  await db.execute(sql, [
    activityId,
    payeeId,
    roleId,
    amount,
    hoursRendered,
    actual,
    net,
    accountId,
  ]);
}
