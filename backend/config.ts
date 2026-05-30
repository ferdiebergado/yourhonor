import type { CamelCasedProperties } from 'type-fest';
import * as z from 'zod';
import logger from './logger';

const LibsqlUrlSchema = z
  .string()
  .trim()
  .refine(
    value => {
      // 1. SQLite in-memory
      if (value === ':memory:') return true;

      // 2. File-based SQLite
      if (value.startsWith('file:')) return true;

      // 3. Remote libSQL-compatible services
      try {
        const url = new URL(value);

        if (url.protocol !== 'libsql:') return false;

        if (!url.hostname) return false;

        return true;
      } catch {
        return false;
      }
    },
    {
      message: 'Invalid libSQL database URL. Expected :memory:, file:path, or libsql://host',
    }
  );

const ConfigSchema = z.object({
  HOST: z.url({ error: 'HOST must be a valid URL' }),
  DATABASE_URL: LibsqlUrlSchema,
  TURSO_AUTH_TOKEN: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string({ error: 'GOOGLE_CLIENT_ID is not set.' }),
  GOOGLE_CLIENT_SECRET: z.string({ error: 'GOOGLE_CLIENT_SECRET is not set.' }),
  GOOGLE_REDIRECT_URI: z.url({ error: 'GOOGLE_REDIRECT_URI not set.' }),
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  ENV: z.enum(['development', 'production', 'testing']).default('production'),
  APP_KEY: z.string().min(1, 'APP_KEY is not set'),
});

type Config = z.infer<typeof ConfigSchema>;

function parseEnv(): Config {
  const { success, error, data } = ConfigSchema.safeParse(process.env);

  if (!success) {
    const errors = z.flattenError(error).fieldErrors;
    const message = 'Invalid environment configuration';
    logger.error({ errors }, error.message);
    throw new Error(message);
  }

  return data;
}

const env = parseEnv();

const config: CamelCasedProperties<Config> = Object.freeze({
  host: env.HOST,
  databaseUrl: env.DATABASE_URL,
  tursoAuthToken: env.TURSO_AUTH_TOKEN,
  googleClientId: env.GOOGLE_CLIENT_ID,
  googleClientSecret: env.GOOGLE_CLIENT_SECRET,
  googleRedirectUri: env.GOOGLE_REDIRECT_URI,
  logLevel: env.LOG_LEVEL,
  env: env.ENV,
  appKey: env.APP_KEY,
} as const);

export default config;
