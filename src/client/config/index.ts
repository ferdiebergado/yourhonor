const config = {
  appTitle: import.meta.env.VITE_APP_TITLE,
  googleClientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: import.meta.env.VITE_GOOGLE_REDIRECT_URI,
  appHost: import.meta.env.VITE_APP_HOST,
} as const;

export default config;
