import config from '@client/config';

const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const STATE_KEY = 'oauth_state';

export function genGoogleAuthUrl(): string {
  const state = crypto.randomUUID();

  sessionStorage.setItem(STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: config.googleRedirectUri,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent',
    state,
  });

  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

export function validateState(receivedState: string): boolean {
  const savedState = sessionStorage.getItem(STATE_KEY);
  sessionStorage.removeItem(STATE_KEY);

  return receivedState === savedState;
}
