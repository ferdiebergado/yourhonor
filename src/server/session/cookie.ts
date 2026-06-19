import type { Cookie } from '@server/types';
import { SESSION } from '@shared/constants';

const BASE_COOKIE: Readonly<Omit<Cookie, 'name' | 'value'>> = {
  path: '/',
  secure: true,
  httpOnly: true,
  sameSite: 'Lax',
};

export function bakeSessionCookie(sessionId: string, expiresAt: string): Cookie {
  const deltaMs = new Date(expiresAt).getTime() - Date.now();
  const maxAge = Math.max(0, Math.floor(deltaMs / 1000));

  return {
    ...BASE_COOKIE,
    name: SESSION.COOKIE_NAME,
    value: sessionId,
    maxAge,
  };
}

export const emptySessionCookie = (): Cookie => ({
  ...BASE_COOKIE,
  name: SESSION.COOKIE_NAME,
  value: '',
  maxAge: 0,
});
