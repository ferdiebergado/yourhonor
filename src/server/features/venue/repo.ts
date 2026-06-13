import type { Database } from '@server/db';
import type { Entity, EntityID } from '@shared/schemas/base';
import { type NewVenue, type VenueItem } from '@shared/schemas/venue';

export async function findActiveVenues(db: Database): Promise<VenueItem[]> {
  const sql = `
SELECT id, name, location
FROM venues
WHERE deleted_at IS NULL
ORDER BY name
;`;

  const { rows } = await db.execute<VenueItem>(sql);

  return rows;
}

export async function createVenue(db: Database, venue: NewVenue): Promise<Entity['id']> {
  const sql = `
INSERT INTO venues (name, location, created_by, updated_by)
VALUES (?, ?, ?, ?)
RETURNING id
  `;

  const { name, location, createdBy } = venue;
  const { rows } = await db.execute<EntityID>(sql, [name, location, createdBy, createdBy]);

  return rows[0].id;
}
