import type { Client } from '@libsql/client';
import type { CreateHonorarium } from '@shared/schemas/honorarium';

export async function createHonorarium(db: Client, honorarium: CreateHonorarium): Promise<void> {
  const sql = `
INSERT INTO honoraria (activity_id, payee_id, role_id, amount, hours_rendered, actual, net, account_id, tin_id)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const { activityId, payeeId, roleId, amount, hoursRendered, actual, net, accountId, tinId } =
    honorarium;

  await db.execute(sql, [
    activityId,
    payeeId,
    roleId,
    amount,
    hoursRendered,
    actual,
    net,
    accountId,
    // eslint-disable-next-line unicorn/no-null
    tinId ?? null,
  ]);
}
