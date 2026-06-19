import { randomBytes } from 'node:crypto';

import { db, type Database } from '@server/db';
import { UnauthorizedError } from '@server/errors';
import { SESSION } from '@shared/constants';
import type { User } from '@shared/schemas/user';
import { createSession, findSession, touchSession } from './repo';

export type Session = {
  sessionId: string;
  userId: User['id'];
  expiresAt: string;
  isActive?: boolean;
  lastActiveAt: string;
};

export async function startSession(db: Database, userId: User['id']): Promise<Session> {
  const session = generateSession(userId);

  return await createSession(db, session);
}

export function generateSession(userId: User['id']): Session {
  const sessionId = randomBytes(SESSION.ID_LENGTH).toString('base64');
  const expiresAt = setExpiryDate();

  return {
    sessionId,
    userId,
    expiresAt,
    lastActiveAt: new Date().toISOString(),
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
