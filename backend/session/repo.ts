import type { Database } from '@backend/db';
import { type NewSession, type Session } from '@shared/schemas/session';
import logger from '../logger';

const sessionColumns =
  'id, session_id sessionId, user_id userId, expires_at expiresAt, last_active_at lastActiveAt, updated_at updatedAt, created_at createdAt, deleted_at deletedAt';

export async function createSession(db: Database, session: NewSession): Promise<Session> {
  logger.info('[DB]: Creating session...');

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
  logger.info('[DB]: Retrieving session...');

  const now = new Date().toISOString();

  const sql = `
SELECT ${sessionColumns}
FROM sessions
WHERE session_id = ? AND datetime(expires_at) > datetime(?) AND is_revoked = 0 AND deleted_at IS NULL
LIMIT 1
`;

  const { rows } = await db.execute<Session>(sql, [id, now]);

  if (rows.length === 0) {
    reportMissingSession(id);
    return;
  }

  return rows[0];
}

export async function touchSession(db: Database, id: string): Promise<boolean> {
  logger.info('[DB]: Updating session...');

  const sql = `
UPDATE sessions
SET last_active_at = ?, updated_at = ?
WHERE session_id = ? AND datetime(expires_at) > datetime(?) AND is_revoked = 0 AND deleted_at IS NULL
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
WHERE session_id = ? AND datetime(expires_at) > datetime(?) AND is_revoked = 0 AND deleted_at IS NULL
    `;

  const { rowsAffected } = await db.execute(sql, [now, id, now]);

  return rowsAffected === 1;
}

export async function revokeSession(
  db: Database,
  sessionId: string,
  userId: number
): Promise<boolean> {
  logger.info('[DB]: Revoking session...');

  const now = new Date().toISOString();

  const sql = `
UPDATE sessions
SET is_revoked = 1, updated_at = ?
WHERE session_id = ? AND user_id = ? AND datetime(expires_at) > datetime(?) AND is_revoked = 0 AND deleted_at IS NULL
`;

  const { rowsAffected } = await db.execute(sql, [now, sessionId, userId, now]);

  return rowsAffected === 1;
}

const reportMissingSession = (sessionId: string) => {
  logger.warn({ sessionId }, 'Session not found');
};
