import type { Database } from '@backend/db';
import { type NewRole, type Role, type RoleBase } from '@shared/schemas/role';
import type { IdRow } from '@shared/types';

export async function createRole(db: Database, role: NewRole): Promise<Role['id']> {
  const sql = `
INSERT INTO roles (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
  `;

  const { name, createdBy, updatedBy } = role;

  const { rows } = await db.execute<IdRow>(sql, [name, createdBy, updatedBy]);

  return rows[0].id;
}

export async function findActiveRoles(db: Database): Promise<RoleBase[]> {
  const sql = `
SELECT id, name
FROM roles
WHERE deleted_at IS NULL
ORDER BY name ASC
`;

  const { rows } = await db.execute<RoleBase>(sql);

  return rows;
}
