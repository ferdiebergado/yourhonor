import type { Client } from '@libsql/client';
import {
  PositionBaseSchema,
  type CreatePosition,
  type PositionBase,
} from '@shared/schemas/position';

export async function findActivePositions(db: Client): Promise<PositionBase[]> {
  const sql = `
SELECT id, name FROM positions
WHERE deleted_at IS NULL
ORDER BY name ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => PositionBaseSchema.parse(row));
}

export async function createPosition(db: Client, position: CreatePosition): Promise<void> {
  const sql = `
INSERT INTO positions (name, created_by, updated_by)
VALUES (?, ?, ?)
`;

  const { name, createdBy, updatedBy } = position;

  await db.execute(sql, [name, createdBy, updatedBy]);
}
