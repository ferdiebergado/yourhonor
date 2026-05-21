import type { Database } from '@backend/db';

import {
  HonorariumDetailRowSchema,
  type HonorariumDetailRow,
  type NewHonorarium,
} from '@shared/schemas/honorarium';

export async function createHonorarium(db: Database, honorarium: NewHonorarium): Promise<void> {
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

export async function findActiveHonorariaByActivity(
  db: Database,
  activityCode: string
): Promise<HonorariumDetailRow[]> {
  const sql = `
SELECT
  h.id id, h.activity_code activityCode, h.salary salary, h.amount amount, h.tax_rate taxRate, h.hours_rendered hoursRendered, h.actual actual, h.net net,
  p.firstname firstname, p.mi mi, p.lastname lastname, p.tin tin,
  r.name role,
  b.name bank,
  a.details details,
  act.title activityTitle, act.start_date startDate, act.end_date endDate,
  v.name venue,
  f.firstname focalFirstname, f.mi focalMi, f.lastname focalLastname,
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
ORDER BY p.firstname, p.mi, p.lastname
`;

  const { rows } = await db.execute<HonorariumDetailRow>(sql, [activityCode]);

  if (rows.length === 0) return [];

  return HonorariumDetailRowSchema.array().parse(rows);
}

const reports = ['Certification', 'Computation', 'ORS-DV', 'Payroll'] as const;

type Report = (typeof reports)[number];

export async function recordUsage(db: Database, report: Report, userId: number): Promise<void> {
  const sql = `
INSERT INTO usage (report_id, created_by)
VALUES (? , ?)
`;

  const reportId = reports.indexOf(report) + 1;

  await db.execute(sql, [reportId, userId]);
}
