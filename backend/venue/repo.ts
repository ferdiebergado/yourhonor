import type { Client } from '@libsql/client';
import { BaseVenueSchema, type BaseVenue } from '@shared/schemas/venue';

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
