import type { Database } from '@backend/db';

import {
  ActivityDetailSchema,
  type ActivityDetail,
  type ActivityUpdate,
  type NewActivity,
} from '@shared/schemas/activity';

const activityDetailSql = `
SELECT
  a.id id, a.title title, a.start_date startDate, a.end_date endDate, a.code code, a.fund_source fundSource, a.created_at createdAt, a.venue_id venueId, a.focal_id focalId,
  v.name venue, v.location location,
  CONCAT(f.firstname, ' ', f.lastname) focal, p.name focalPosition
FROM activities a
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
JOIN positions p ON p.id = f.position_id
`;

export async function createActivity(db: Database, activity: NewActivity): Promise<void> {
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
  db: Database,
  userId: number
): Promise<ActivityDetail[]> {
  const sql = `
${activityDetailSql}
WHERE a.deleted_at IS NULL AND a.created_by = ?
ORDER BY a.created_at DESC
  `;

  const { rows } = await db.execute<ActivityDetail>(sql, [userId]);

  return rows;
}

export async function findActiveActivityByUser(
  db: Database,
  code: string,
  userId: number
): Promise<ActivityDetail | undefined> {
  const sql = `
${activityDetailSql}
WHERE a.deleted_at IS NULL AND a.code = ? AND a.created_by = ?
LIMIT 1
  `;

  const { rows } = await db.execute<ActivityDetail>(sql, [code, userId]);

  return ActivityDetailSchema.parse(rows[0]);
}

export async function updateActivity(
  db: Database,
  activityCode: string,
  data: ActivityUpdate
): Promise<boolean> {
  const sql = `
UPDATE activities
SET title=?, venue_id=?, code=?, fund_source=?, focal_id=?, start_date=?, end_date=?, updated_by=?
WHERE code=? AND created_by=? AND deleted_at IS NULL
  `;

  const { title, venueId, code, fundSource, focalId, startDate, endDate, updatedBy } = data;
  const { rowsAffected } = await db.execute(sql, [
    title,
    venueId,
    code,
    fundSource,
    focalId,
    startDate,
    endDate,
    updatedBy,
    activityCode,
    updatedBy,
  ]);

  return rowsAffected === 1;
}
