import type { Database } from '@server/db';
import {
  HonorariumDetailSchema,
  HonorariumFormSchema,
  HonorariumInfoSchema,
  type Honorarium,
  type HonorariumDetail,
  type HonorariumInfo,
  type HonorariumUpdate,
  type NewHonorarium,
} from '@shared/schemas/honorarium';
import type { User } from '@shared/schemas/user';

export async function createHonorarium(
  db: Database,
  honorarium: NewHonorarium,
): Promise<void> {
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
    createdBy,
  ]);
}

const honorariumInfoSql = `
SELECT
  h.id id, h.salary salary, h.amount amount, h.tax_rate taxRate, h.hours_rendered hoursRendered, h.actual actual, h.net net, h.payee_id payeeId, h.role_id roleId, h.account_id accountId,
  p.firstname firstname, p.mi mi, p.lastname lastname,
  r.name role
FROM honoraria h
LEFT JOIN payees p ON p.id = h.payee_id
LEFT JOIN roles r ON r.id = h.role_id
`;

export async function findActiveHonorariaByActivity(
  db: Database,
  activityCode: string,
  userId: User['id'],
): Promise<HonorariumInfo[]> {
  const sql = `
${honorariumInfoSql}
WHERE h.activity_code = ? AND h.created_by = ? AND h.deleted_at IS NULL
ORDER BY firstname, mi, lastname
`;

  const { rows } = await db.execute<HonorariumInfo>(sql, [
    activityCode,
    userId,
  ]);

  if (rows.length === 0) return [];

  return HonorariumInfoSchema.array().parse(rows);
}

export async function findActiveHonorariaWithAccountByActivity(
  db: Database,
  activityCode: string,
  userId: User['id'],
): Promise<HonorariumDetail[]> {
  const sql = `
SELECT
  h.id id, h.salary salary, h.amount amount, h.tax_rate taxRate, h.hours_rendered hoursRendered, h.actual actual, h.net net,
  p.firstname firstname, p.mi mi, p.lastname lastname, p.tin tin,
  r.name role,
  a.bank_branch bankBranch, a.account_name accountName, a.account_no_masked accountNoMasked, a.account_no accountNo, a.dob dob,
  b.name bank
FROM honoraria h
LEFT JOIN payees p ON p.id = h.payee_id
LEFT JOIN roles r ON r.id = h.role_id
LEFT JOIN accounts a ON a.id = h.account_id
LEFT JOIN banks b ON b.id = a.bank_id
WHERE h.activity_code = ? AND h.created_by = ? AND h.deleted_at IS NULL
ORDER BY firstname, mi, lastname
`;

  const { rows } = await db.execute<HonorariumDetail>(sql, [
    activityCode,
    userId,
  ]);

  if (rows.length === 0) return [];

  return HonorariumDetailSchema.array().parse(rows);
}

const reports = ['Certification', 'Computation', 'ORS-DV', 'Payroll'] as const;

type Report = (typeof reports)[number];

export async function recordUsage(
  db: Database,
  report: Report,
  userId: number,
): Promise<void> {
  const sql = `
INSERT INTO usage (report_id, created_by)
VALUES (? , ?)
`;

  const reportId = reports.indexOf(report) + 1;

  await db.execute(sql, [reportId, userId]);
}

export async function updateHonorarium(
  db: Database,
  id: number,
  data: HonorariumUpdate,
): Promise<boolean> {
  const sql = `
UPDATE honoraria
SET activity_code=?, payee_id=?, role_id=?, amount=?, hours_rendered=?, actual=?, net=?, account_id=?, tax_rate=?, salary=?, updated_by=?
WHERE id=? AND created_by=? AND deleted_at IS NULL
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
    updatedBy,
  } = data;

  const { rowsAffected } = await db.execute(sql, [
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
    updatedBy,
    id,
    updatedBy,
  ]);

  return rowsAffected === 1;
}

export async function findActiveHonorarium(
  db: Database,
  id: Honorarium['id'],
  userId: User['id'],
) {
  const sql = `
SELECT activity_code activityCode, payee_id payeeId, role_id roleId, amount, account_id accountId, tax_rate taxRate, salary
FROM honoraria
WHERE id = ? AND created_by = ? AND deleted_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute(sql, [id, userId]);

  if (rows.length === 0) return;

  return HonorariumFormSchema.parse(rows[0]);
}

export async function findActiveHonorariumInfo(
  db: Database,
  id: Honorarium['id'],
  userId: User['id'],
) {
  const sql = `
${honorariumInfoSql}
WHERE id = ? AND created_by = ? AND deleted_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute(sql, [id, userId]);

  if (rows.length === 0) return;

  return HonorariumInfoSchema.parse(rows[0]);
}
