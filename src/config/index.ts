import * as z from 'zod';

z.config({ jitless: true });

const ConfigSchema = z.object({
  VITE_APP_TITLE: z.string().min(1),
  VITE_GOOGLE_CLIENT_ID: z.string({ error: 'VITE_GOOGLE_CLIENT_ID is not set.' }).min(1),
  VITE_GOOGLE_REDIRECT_URI: z.url({ error: 'VITE_GOOGLE_REDIRECT_URI is not set.' }).min(1),
  VITE_APP_HOST: z.url({ error: 'VITE_APP_HOST must be a valid URL' }),
});

type Config = z.infer<typeof ConfigSchema>;

function parseEnv(): Config {
  const { success, error, data } = ConfigSchema.safeParse(import.meta.env);

  if (!success) {
    const errors = z.flattenError(error).fieldErrors;
    const message = 'Invalid environment configuration';
    console.error(error.message, { errors });
    throw new Error(message);
  }

  return data;
}

const env = parseEnv();

const config = Object.freeze({
  appTitle: env.VITE_APP_TITLE,
  googleClientId: env.VITE_GOOGLE_CLIENT_ID,
  googleRedirectUri: env.VITE_GOOGLE_REDIRECT_URI,
  appHost: env.VITE_APP_HOST,
} as const);

export default config;
