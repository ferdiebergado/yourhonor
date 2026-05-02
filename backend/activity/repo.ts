import type { Client } from '@libsql/client';
import { ActivityIdSchema, type Activity, type CreateActivity } from '@shared/schemas/activity';

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
