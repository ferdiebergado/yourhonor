import type { Client } from '@libsql/client';
import {
  HonorariumDetailRowSchema,
  type HonorariumDetailRow,
  type NewHonorarium,
} from '@shared/schemas/honorarium';
import { snakeToCamel } from '@shared/utils';

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

export async function findActiveHonorariaPerActivity(
  db: Client,
  activityCode: string
): Promise<HonorariumDetailRow[]> {
  const sql = `
SELECT
  h.id id, h.activity_code activity_code, h.salary salary, h.amount amount, h.tax_rate tax_rate, h.hours_rendered hours_rendered, h.actual actual, h.net net,
  p.firstname firstname, p.mi mi, p.lastname lastname, p.tin tin,
  r.name role,
  b.name bank,
  a.details details,
  act.title activityTitle, act.start_date start_date, act.end_date end_date,
  v.name venue,
  f.firstname focal_firstname, f.mi focal_mi, f.lastname focal_lastname,
  pos.name position
FROM honoraria h
LEFT JOIN payees p ON p.id = h.payee_id
LEFT JOIN roles r ON r.id = h.role_id
LEFT JOIN accounts a ON a.id = h.account_id
LEFT JOIN activities act ON act.code = h.activity_code
JOIN focals f ON f.id = act.focal_id
JOIN banks b ON b.id = a.bank_id
JOIN venues v ON v.id = act.venue_id
JOIN positions pos ON pos.id = f.position_id
WHERE h.activity_code = ? AND h.deleted_at IS NULL
ORDER BY firstname
  `;

  const { rows } = await db.execute(sql, [activityCode]);

  if (rows.length === 0) return [];

  return rows.map(row => HonorariumDetailRowSchema.parse(snakeToCamel(row)));
}
