import type { Client } from '@libsql/client';

import {
  ActivityDetailSchema,
  type ActivityDetail,
  type NewActivity,
} from '@shared/schemas/activity';
import { snakeToCamel } from '@shared/utils';

const activityDetailSql = `
SELECT
  a.id id, a.title title, a.start_date start_date, a.end_date end_date, a.code code, a.fund_source fund_source, a.created_at created_at,
  v.name venue, v.location location,
  CONCAT(f.firstname, ' ', f.lastname) focal, p.name focal_position
FROM activities a
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
JOIN positions p ON p.id = f.position_id
`;

export async function createActivity(db: Client, activity: NewActivity): Promise<void> {
  const sql = `
INSERT INTO activities (title, venue_id, start_date, end_date, code, fund_source, focal_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  const { title, venueId, startDate, endDate, code, fundSource, focalId, createdBy } = activity;

  await db.execute(sql, [
    title,
    venueId,
    startDate,
    endDate,
    code,
    fundSource,
    focalId,
    createdBy,
    createdBy,
  ]);
}

export async function findActiveActivitiesByUser(
  db: Client,
  userId: number
): Promise<ActivityDetail[]> {
  const sql = `
${activityDetailSql}
WHERE a.deleted_at IS NULL AND a.created_by = ?
ORDER BY a.created_at DESC
  `;

  const { rows } = await db.execute(sql, [userId]);

  if (rows.length === 0) return [];

  return rows.map(row => ActivityDetailSchema.parse(snakeToCamel(row)));
}

export async function findActiveActivityByUser(
  db: Client,
  code: string,
  userId: number
): Promise<ActivityDetail | undefined> {
  const sql = `
${activityDetailSql}
WHERE a.deleted_at IS NULL AND a.code = ? AND a.created_by = ?
LIMIT 1
  `;

  const { rows } = await db.execute(sql, [code, userId]);

  if (rows.length === 0) return;

  return ActivityDetailSchema.parse(snakeToCamel(rows[0]));
}
