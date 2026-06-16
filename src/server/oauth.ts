import { OAuth2Client } from 'google-auth-library';

import { GOOGLE_ACCOUNTS_ORIGIN } from '@shared/constants';
import type { NewUser } from '@shared/schemas/user';
import config from './config';
import { db } from './db';
import { UnauthorizedError } from './errors';
import { startSession } from './session';
import { upsertUser } from './user/repo';

const oauthClient = new OAuth2Client({
  clientId: config.googleClientId,
  clientSecret: config.googleClientSecret,
  redirectUri: config.googleRedirectUri,
});

async function verifyAuthCode(oauthClient: OAuth2Client, authCode: string): Promise<NewUser> {
  const {
    tokens: { id_token },
  } = await oauthClient.getToken(authCode);
  if (!id_token) throw new UnauthorizedError('Missing id token');

  const ticket = await oauthClient.verifyIdToken({
    idToken: id_token,
    audience: config.googleClientId,
  });

  const tokenPayload = ticket.getPayload();

  if (!tokenPayload) throw new UnauthorizedError('Invalid token payload');

  if (tokenPayload.iss !== GOOGLE_ACCOUNTS_ORIGIN) throw new UnauthorizedError('Invalid issuer');

  return {
    googleId: tokenPayload.sub,
    name: tokenPayload.name,
    email: tokenPayload.email,
    picture: tokenPayload.picture,
  };
}

export async function signin(
  code: string
): Promise<{ user: NewUser; sessionId: string; expiresAt: string }> {
  const user = await verifyAuthCode(oauthClient, code);
  const userId = await upsertUser(db, user);
  const { sessionId, expiresAt } = await startSession(db, userId);

  return { user, sessionId, expiresAt };
}
