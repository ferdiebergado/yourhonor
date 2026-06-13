import type { Database } from '@server/db';
import type { Entity, EntityID } from '@shared/schemas/base';
import { FocalDetailSchema, type FocalDetail, type NewFocal } from '@shared/schemas/focal';

export async function findActiveFocals(db: Database): Promise<FocalDetail[]> {
  const sql = `
SELECT f.id id, f.firstname firstname, f.mi mi, f.lastname lastname, f.position_id positionId, p.name position
FROM focals f
LEFT JOIN positions p ON f.position_id = p.id
WHERE f.deleted_at IS NULL
ORDER BY firstname, mi, lastname
`;

  const { rows } = await db.execute<FocalDetail>(sql);

  return FocalDetailSchema.array().parse(rows);
}

export async function createFocal(db: Database, focal: NewFocal): Promise<Entity['id']> {
  const sql = `
INSERT INTO focals (firstname, mi, lastname,  position_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const { firstname, mi, lastname, positionId, createdBy } = focal;

  const { rows } = await db.execute<EntityID>(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    positionId,
    createdBy,
    createdBy,
  ]);

  return rows[0].id;
}
