import type { Database } from '@backend/db';
import type { Entity, EntityID } from '@shared/schemas/base';
import { type NewRole, type RoleItem } from '@shared/schemas/role';

export async function createRole(db: Database, role: NewRole): Promise<Entity['id']> {
  const sql = `
INSERT INTO roles (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
  `;

  const { name, createdBy } = role;

  const { rows } = await db.execute<EntityID>(sql, [name, createdBy, createdBy]);

  return rows[0].id;
}

export async function findActiveRoles(db: Database): Promise<RoleItem[]> {
  const sql = `
SELECT id, name
FROM roles
WHERE deleted_at IS NULL
ORDER BY name
`;

  const { rows } = await db.execute<RoleItem>(sql);

  return rows;
}
