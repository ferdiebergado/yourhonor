import type { Client } from '@libsql/client';
import { BaseVenueSchema, type BaseVenue, type NewVenue } from '@shared/schemas/venue';

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

type CreateVenueResultSet = {
  id: number;
};

export async function createVenue(db: Client, venue: NewVenue): Promise<number> {
  const sql = `
INSERT INTO venues (name, location, created_by, updated_by)
VALUES (?, ?, ?, ?)
RETURNING id
  `;

  const { name, location, createdBy, updatedBy } = venue;
  const { rows } = await db.execute(sql, [name, location, createdBy, updatedBy]);

  const { id } = rows[0] as unknown as CreateVenueResultSet;

  return id;
}
