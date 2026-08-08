import { createClient, type Client } from '@libsql/client';
import { readFileSync } from 'fs';
import path from 'path';

let schemaCache: string;

export async function createTestDB(): Promise<Client> {
  try {
    const db = createClient({
      url: ':memory:',
    });

    if (!schemaCache) {
      const schemaPath = path.resolve('init.sql');
      schemaCache = readFileSync(schemaPath, { encoding: 'utf8' });
    }

    await db.executeMultiple(schemaCache);

    return db;
  } catch (error) {
    console.error('Failed to initialize test DB:', error);
    throw error;
  }
}
