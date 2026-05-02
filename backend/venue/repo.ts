import type { Client } from '@libsql/client';
import {
  BaseVenueSchema,
  VenueIdSchema,
  type BaseVenue,
  type CreateVenue,
  type Venue,
} from '@shared/schemas/venue';

export async function findActiveVenues(db: Client): Promise<BaseVenue[]> {
  const sql = `
SELECT id, name, location
FROM venues
WHERE deleted_at IS NULL
ORDER BY name ASC
;`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => BaseVenueSchema.parse(row));
}

export async function createVenue(db: Client, venue: CreateVenue): Promise<Venue['id']> {
  const sql = `
INSERT INTO venues (name, location, created_by, updated_by)
VALUES (?, ?, ?, ?)
RETURNING id
  `;

  const { name, location, createdBy, updatedBy } = venue;
  const { rows } = await db.execute(sql, [name, location, createdBy, updatedBy]);

  if (rows.length === 0) throw new Error('Failed to create venue.');

  return VenueIdSchema.parse(rows[0]).id;
}
