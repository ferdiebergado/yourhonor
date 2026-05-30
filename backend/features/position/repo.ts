import type { Database } from '@backend/db';
import type { Entity, EntityID } from '@shared/schemas/base';
import { type NewPosition, type PositionItem } from '@shared/schemas/position';

export async function findActivePositions(db: Database): Promise<PositionItem[]> {
  const sql = `
SELECT id, name
FROM positions
WHERE deleted_at IS NULL
ORDER BY name
`;

  const { rows } = await db.execute<PositionItem>(sql);

  return rows;
}

export async function createPosition(db: Database, position: NewPosition): Promise<Entity['id']> {
  const sql = `
INSERT INTO positions (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
`;

  const { name, createdBy } = position;
  const { rows } = await db.execute<EntityID>(sql, [name, createdBy, createdBy]);

  return rows[0].id;
}
