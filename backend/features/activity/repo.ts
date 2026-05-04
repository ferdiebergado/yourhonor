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
SELECT a.id AS id, a.title AS title, a.start_date AS start_date, a.end_date AS end_date, a.code AS code, v.name AS venue, CONCAT(f.firstname, ' ', f.lastname) focal
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
  id: number,
  userId: number
): Promise<ActivityFullDetail | undefined> {
  const sql = `
SELECT
  a.id AS id, a.title AS title, a.start_date AS start_date, a.end_date AS end_date, a.code AS code, a.created_at AS created_at, a.updated_at AS updated_at,
  v.name AS venue, v.location AS location,
  CONCAT(f.firstname, ' ', f.lastname) focal, p.name AS focal_position
FROM activities a
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
JOIN positions p ON p.id = f.position_id
WHERE a.deleted_at IS NULL AND a.id = ? AND a.created_by = ?
LIMIT 1
  `;

  const { rows } = await db.execute(sql, [id, userId]);

  if (rows.length === 0) return;

  return ActivityFullSchema.parse(snakeToCamel(rows[0]));
}
