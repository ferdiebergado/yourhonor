import { randBase64 } from '@backend/utils';
import { SESSION } from '@shared/constants';
import type { NewSession, Session } from '@shared/schemas/session';
import { db, type Database } from '../db';
import { UnauthorizedError } from '../http/errors';
import { createSession, findSession, touchSession } from './repo';

export async function startSession(db: Database, userId: number): Promise<Session> {
  const session = newSession(userId);

  return await createSession(db, session);
}

export function newSession(userId: number): NewSession {
  const sessionId = randBase64(SESSION.ID_LENGTH);
  const expiresAt = setExpiryDate();

  return {
    sessionId,
    userId,
    expiresAt,
  };
}

export async function getSession(req: Request): Promise<Session> {
  const sessionId = req.headers.get(SESSION.HEADER_NAME);
  if (!sessionId) throw new UnauthorizedError('no session ID provided');

  const session = await findSession(db, sessionId);
  if (!session) throw new UnauthorizedError('session not found');

  const lastActiveTime = new Date(session.lastActiveAt).getTime();
  const elapsedTime = Date.now() - lastActiveTime;
  const minuteMs = 1000 * 60;
  if (elapsedTime > minuteMs) await touchSession(db, sessionId);

  return session;
}

export const setExpiryDate = (minutes = SESSION.DURATION_MINUTES): string =>
  new Date(Date.now() + minutes * 60_000).toISOString();
