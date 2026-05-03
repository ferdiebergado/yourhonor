import type { Client } from '@libsql/client';
import {
  ActivityDetailSchema,
  ActivityIdSchema,
  type Activity,
  type ActivityDetail,
  type CreateActivity,
} from '@shared/schemas/activity';
import { snakeToCamel } from '@shared/utils';

export async function createActivity(
  db: Client,
  activity: CreateActivity
): Promise<Activity['id']> {
  const sql = `
INSERT INTO activities (title, venue_id, start_date, end_date, code, fund_source, focal_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
RETURNING id;`;

  const { title, venueId, startDate, endDate, code, fundSource, focalId, createdBy, updatedBy } =
    activity;

  const { rows } = await db.execute(sql, [
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

  if (rows.length === 0) throw new Error('Failed to create activity');

  return ActivityIdSchema.parse(rows[0]).id;
}

export async function findActiveActivitiesDetailed(db: Client): Promise<ActivityDetail[]> {
  const sql = `
SELECT a.title AS title, a.start_date AS start_date, a.end_date AS end_date, a.code AS code, v.name AS venue, CONCAT(f.firstname, ' ', f.lastname) focal
FROM activities a
LEFT JOIN venues v ON v.id = a.venue_id
LEFT JOIN focals f ON f.id = a.focal_id
WHERE a.deleted_at IS NULL
ORDER BY a.created_at DESC
  `;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => ActivityDetailSchema.parse(snakeToCamel(row)));
}
