import type { Database } from '@backend/db';
import { type NewPosition, type Position, type PositionBase } from '@shared/schemas/position';
import type { IdRow } from '@shared/types';

export async function findActivePositions(db: Database): Promise<PositionBase[]> {
  const sql = `
SELECT id, name FROM positions
WHERE deleted_at IS NULL
ORDER BY name ASC
`;

  const { rows } = await db.execute<PositionBase>(sql);

  return rows;
}

export async function createPosition(db: Database, position: NewPosition): Promise<Position['id']> {
  const sql = `
INSERT INTO positions (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
`;

  const { name, createdBy, updatedBy } = position;
  const { rows } = await db.execute<IdRow>(sql, [name, createdBy, updatedBy]);

  return rows[0].id;
}
