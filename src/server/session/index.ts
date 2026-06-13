import { db, type Database } from '@server/db';
import { UnauthorizedError } from '@server/errors';
import { randBase64 } from '@server/utils';
import { SESSION } from '@shared/constants';
import { createSession, findSession, touchSession } from './repo';

export type Session = {
  sessionId: string;
  userId: number;
  expiresAt: string;
  isActive?: boolean;
  lastActiveAt: string;
};

export type NewSession = Omit<Session, 'id' | 'lastActiveAt'>;

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
