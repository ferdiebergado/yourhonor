import type { Client } from '@libsql/client';
import { FocalBaseSchema, type CreateFocal, type FocalBase } from '@shared/schemas/focal';
import { snakeToCamel } from '@shared/utils';

export async function findActiveFocals(db: Client): Promise<FocalBase[]> {
  const sql = `
SELECT f.id, f.firstname, f.mi, f.lastname, f.sex, f.position_id, p.name AS position
FROM focals f
LEFT JOIN positions p ON f.position_id = p.id
WHERE f.deleted_at IS NULL
ORDER BY f.firstname ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => FocalBaseSchema.parse(snakeToCamel(row)));
}

type CreateFocalResultSet = {
  id: number;
};

export async function createFocal(db: Client, focal: CreateFocal): Promise<number> {
  const sql = `
INSERT INTO focals (firstname, mi, lastname, sex, position_id, created_by, updated_by)
VALUES (?, ?, ?, ?, ?, ?, ?)
RETURNING id
`;

  const { firstname, mi, lastname, sex, positionId, createdBy, updatedBy } = focal;

  const { rows } = await db.execute(sql, [
    firstname,
    // eslint-disable-next-line unicorn/no-null
    mi ?? null,
    lastname,
    sex,
    positionId,
    createdBy,
    updatedBy,
  ]);

  const { id } = rows[0] as unknown as CreateFocalResultSet;

  return id;
}
