import type { Database } from '@backend/db';
import { type Focal, type FocalBase, type NewFocal } from '@shared/schemas/focal';
import type { IdRow } from '@shared/types';

export async function findActiveFocals(db: Database): Promise<FocalBase[]> {
  const sql = `
SELECT f.id, f.firstname, f.mi, f.lastname, f.position_id positionId, p.name AS position
FROM focals f
LEFT JOIN positions p ON f.position_id = p.id
WHERE f.deleted_at IS NULL
ORDER BY f.firstname ASC
`;

  const { rows } = await db.execute<FocalBase>(sql);

  return rows;
}

export async function createFocal(db: Database, focal: NewFocal): Promise<Focal['id']> {
  const sql = `
INSERT INTO focals (firstname, mi, lastname,  position_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const { firstname, mi, lastname, positionId, createdBy, updatedBy } = focal;

  const { rows } = await db.execute<IdRow>(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    positionId,
    createdBy,
    updatedBy,
  ]);

  return rows[0].id;
}
