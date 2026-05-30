/* eslint-disable unicorn/no-null */

import type { Database } from '@backend/db';
import type { EntityID } from '@shared/schemas/base';
import { type NewUser, type User } from '@shared/schemas/user';

export async function upsertUser(db: Database, user: NewUser): Promise<User['id']> {
  const sql = `
INSERT INTO users (google_id, name, email, picture, role, is_active)
VALUES (?, ?, ?, ?, ?, ?)
ON CONFLICT (google_id)
DO UPDATE SET
  name = EXCLUDED.name,
  email = EXCLUDED.email,
  picture = EXCLUDED.picture,
  last_login_at = ?
RETURNING id
`;

  const { rows } = await db.execute<EntityID>(sql, [
    user.googleId,
    user.name ?? null,
    user.email ?? null,
    user.picture ?? null,
    user.role ?? 'user',
    user.isActive ?? 1,
    new Date().toISOString(),
  ]);

  const row = rows[0];

  return row.id;
}

export default async function findUser(db: Database, id: number): Promise<User | undefined> {
  const sql = `
SELECT id, google_id googleId, email, name, picture, role, is_active isActive, last_login_at lastLoginAt, updated_at updatedAt, created_at createAt
FROM users
WHERE id = ? AND is_active = 1
LIMIT 1
`;

  const { rows } = await db.execute<User>(sql, [id]);

  if (rows.length === 0) return;

  return rows[0];
}
