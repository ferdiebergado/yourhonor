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

type CreatePositionResultSet = {
  id: number;
};

export async function createPosition(db: Client, position: CreatePosition): Promise<number> {
  const sql = `
INSERT INTO positions (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
`;

  const { name, createdBy, updatedBy } = position;

  const { rows } = await db.execute(sql, [name, createdBy, updatedBy]);
  const { id } = rows[0] as unknown as CreatePositionResultSet;

  return id;
}
