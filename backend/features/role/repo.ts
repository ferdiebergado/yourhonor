import type { Client } from '@libsql/client';
import { RoleBaseSchema, type CreateRole, type RoleBase } from '@shared/schemas/role';

type CreateRoleResultSet = {
  id: number;
};

export async function createRole(db: Client, role: CreateRole): Promise<number> {
  const sql = `
INSERT INTO roles (name, created_by, updated_by)
VALUES (?, ?, ?)
RETURNING id
  `;

  const { name, createdBy, updatedBy } = role;

  const { rows } = await db.execute(sql, [name, createdBy, updatedBy]);

  const { id } = rows[0] as unknown as CreateRoleResultSet;

  return id;
}

export async function findActiveRoles(db: Client): Promise<RoleBase[]> {
  const sql = `
SELECT id, name
FROM roles
WHERE deleted_at IS NULL
ORDER BY name ASC
`;

  const { rows } = await db.execute(sql);

  if (rows.length === 0) return [];

  return rows.map(row => RoleBaseSchema.parse(row));
}
