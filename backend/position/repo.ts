import type { Client } from '@libsql/client';
import {
  PositionBaseSchema,
  PositionSchema,
  type CreatePosition,
  type Position,
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

export async function createPosition(db: Client, position: CreatePosition): Promise<Position> {
  const sql = `
INSERT INTO positions (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING *
`;

  const { name, createdBy, updatedBy } = position;

  const { rows } = await db.execute(sql, [name, createdBy, updatedBy]);

  if (rows.length === 0) throw new Error('Failed to create position');

  return PositionSchema.parse(rows[0]);
}
