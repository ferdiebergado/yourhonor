import type { Database } from '@backend/db';
import { type BaseVenue, type NewVenue, type Venue } from '@shared/schemas/venue';
import type { IdRow } from '@shared/types';

export async function findActiveVenues(db: Database): Promise<BaseVenue[]> {
  const sql = `
SELECT id, name, location
FROM venues
WHERE deleted_at IS NULL
ORDER BY name ASC
;`;

  const { rows } = await db.execute<BaseVenue>(sql);

  return rows;
}

export async function createVenue(db: Database, venue: NewVenue): Promise<Venue['id']> {
  const sql = `
INSERT INTO venues (name, location, created_by, updated_by)
VALUES (?, ?, ?, ?)
RETURNING id
  `;

  const { name, location, createdBy, updatedBy } = venue;
  const { rows } = await db.execute<IdRow>(sql, [name, location, createdBy, updatedBy]);

  return rows[0].id;
}
