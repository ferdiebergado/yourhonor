import type { Client } from '@libsql/client';
import { RoleBaseSchema, type CreateRole, type RoleBase } from '@shared/schemas/role';

export async function createRole(db: Client, role: CreateRole): Promise<void> {
  const sql = `
INSERT INTO roles (name, created_by, updated_by)
VALUES (?, ?, ?)
  `;

  const { name, createdBy, updatedBy } = role;

  await db.execute(sql, [name, createdBy, updatedBy]);
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
