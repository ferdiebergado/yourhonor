import type { Database } from '@server/db';
import type { Session } from '.';

const sessionColumns =
  'id, session_id sessionId, user_id userId, expires_at expiresAt, last_active_at lastActiveAt, updated_at updatedAt, created_at createdAt, deleted_at deletedAt';

export async function createSession(db: Database, session: Session): Promise<Session> {
  const sql = `
INSERT INTO sessions (session_id, user_id, expires_at)
VALUES (?, ?, ?)
RETURNING ${sessionColumns}
`;

  const { rows } = await db.execute<Session>(sql, [
    session.sessionId,
    session.userId,
    session.expiresAt,
  ]);

  return rows[0];
}

export async function findSession(db: Database, id: string): Promise<Session | undefined> {
  const now = new Date().toISOString();

  const sql = `
SELECT ${sessionColumns}
FROM sessions
WHERE session_id = ? AND datetime(expires_at) > datetime(?) AND revoked_at IS NULL AND deleted_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute<Session>(sql, [id, now]);

  if (rows.length === 0) return;

  return rows[0];
}

export async function touchSession(db: Database, id: string): Promise<boolean> {
  const sql = `
UPDATE sessions
SET last_active_at = ?, updated_at = ?
WHERE session_id = ? AND datetime(expires_at) > datetime(?) AND revoked_at IS NULL AND deleted_at IS NULL
`;

  const now = new Date().toISOString();

  const { rowsAffected } = await db.execute(sql, [now, now, id, now]);

  return rowsAffected === 1;
}

export async function softDeleteSession(db: Database, id: string): Promise<boolean> {
  const now = new Date().toISOString();

  const sql = `
UPDATE sessions
SET deleted_at = ?
WHERE session_id = ? AND datetime(expires_at) > datetime(?) AND revoked_at IS NULL AND deleted_at IS NULL
    `;

  const { rowsAffected } = await db.execute(sql, [now, id, now]);

  return rowsAffected === 1;
}

export async function revokeSession(
  db: Database,
  sessionId: string,
  userId: number
): Promise<boolean> {
  const now = new Date().toISOString();

  const sql = `
UPDATE sessions
SET revoked_at = ?, updated_at = ?
WHERE session_id = ? AND user_id = ? AND datetime(expires_at) > datetime(?) AND revoked_at IS NULL AND deleted_at IS NULL
`;

  const { rowsAffected } = await db.execute(sql, [now, now, sessionId, userId, now]);

  return rowsAffected === 1;
}
