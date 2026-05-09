import type { Client } from '@libsql/client';
import {
  ActivityDetailSchema,
  ActivityFullSchema,
  type ActivityDetail,
  type ActivityFullDetail,
  type CreateActivity,
} from '@shared/schemas/activity';
import { snakeToCamel } from '@shared/utils';

export async function createActivity(db: Client, activity: CreateActivity): Promise<void> {
  const sql = `
INSERT INTO activities (title, venue_id, start_date, end_date, code, fund_source, focal_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const { title, venueId, startDate, endDate, code, fundSource, focalId, createdBy, updatedBy } =
    activity;

  await db.execute(sql, [
    title,
    venueId,
    startDate,
    endDate,
    code,
    fundSource,
    focalId,
    createdBy,
    updatedBy,
  ]);
}

export async function findActiveActivitiesDetailedByUser(
  db: Client,
  userId: number
): Promise<ActivityDetail[]> {
  const sql = `
SELECT a.id id, a.title title, a.start_date start_date, a.end_date end_date, a.code code, a.fund_source fund_source, v.name venue, CONCAT(f.firstname, ' ', f.lastname) focal
FROM activities a
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
WHERE a.deleted_at IS NULL AND a.created_by = ?
ORDER BY a.created_at DESC
  `;

  const { rows } = await db.execute(sql, [userId]);

  if (rows.length === 0) return [];

  return rows.map(row => ActivityDetailSchema.parse(snakeToCamel(row)));
}

export async function findActiveActivityDetailedByUser(
  db: Client,
  code: string,
  userId: number
): Promise<ActivityFullDetail | undefined> {
  const sql = `
SELECT
  a.id id, a.title title, a.start_date start_date, a.end_date end_date, a.code code, a.fund_source fund_source, a.created_at created_at, a.updated_at updated_at,
  v.name venue, v.location location,
  CONCAT(f.firstname, ' ', f.lastname) focal, p.name focal_position
FROM activities a
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
JOIN positions p ON p.id = f.position_id
WHERE a.deleted_at IS NULL AND a.code = ? AND a.created_by = ?
LIMIT 1
  `;

  const { rows } = await db.execute(sql, [code, userId]);

  if (rows.length === 0) return;

  return ActivityFullSchema.parse(snakeToCamel(rows[0]));
}
