import { createClient, type Client, type InArgs, type ResultSet } from '@libsql/client';

import config from './config';
import { ServiceUnavailableError } from './errors';
import logger from './logger';

// Type definitions
type SqlValue = string | number | bigint | boolean | Uint8Array | ArrayBuffer | null;
type QueryRow = Record<string, unknown>;
export type QueryResult<T extends QueryRow = QueryRow> = {
  rows: T[];
  rowsAffected: number;
};

// Database interface for backward compatibility
export interface Database {
  execute<T extends QueryRow>(sql: string, args?: readonly SqlValue[]): Promise<QueryResult<T>>;
  transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T>;
  close(): void;
}

// Database client instance
let _dbClient: Client | undefined;

/**
 * Initializes and returns the database client.
 * Performs a health check by executing a simple query.
 */
async function initializeDbClient(): Promise<Client> {
  if (_dbClient) return _dbClient;

  try {
    logger.info('Initializing database...');
    _dbClient = createClient({
      url: config.databaseUrl,
      authToken: config.tursoAuthToken,
    });

    // Health check
    await runQuery(_dbClient, 'SELECT 1');

    logger.info('Database is up.');

    return _dbClient;
  } catch (error) {
    logger.error(error, 'Failed to initialize the database.');
    throw new ServiceUnavailableError();
  }
}

/**
 * Gets the initialized database client.
 * Throws an error if the client hasn't been initialized yet.
 */
function getDbClient(): Client {
  if (!_dbClient)
    throw new Error('Database client is not initialized. Call initializeDbClient first.');

  return _dbClient;
}

/**
 * Internal helper to execute a query.
 */
async function runQuery<T extends QueryRow>(
  executor: { execute(sql: string | { sql: string; args: InArgs }): Promise<ResultSet> },
  sql: string,
  args?: readonly SqlValue[]
): Promise<QueryResult<T>> {
  const result = args
    ? await executor.execute({
        sql,
        args: args as InArgs,
      })
    : await executor.execute(sql);

  return {
    rows: result.rows as unknown as T[],
    rowsAffected: result.rowsAffected,
  };
}

/**
 * Executes a SQL query.
 */
export async function execute<T extends QueryRow>(
  sql: string,
  args?: readonly SqlValue[]
): Promise<QueryResult<T>> {
  const client = getDbClient();
  return runQuery<T>(client, sql, args);
}

/**
 * Runs a function within a database transaction.
 * Automatically commits on success or rolls back on error.
 * Returns a Database-like object for the transaction.
 */
export async function transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T> {
  const client = getDbClient();
  const tx = await client.transaction();

  // Create a Database-like object for the transaction
  const txDatabase: Database = {
    execute: async <T extends QueryRow>(
      sql: string,
      args?: readonly SqlValue[]
    ): Promise<QueryResult<T>> => runQuery<T>(tx, sql, args),
    transaction: () => {
      throw new Error('Nested transactions are not supported');
    },

    close: () => {
      throw new Error('Cannot close transaction connection');
    },
  };

  try {
    const result = await fn(txDatabase);
    await tx.commit();
    return result;
  } catch (error) {
    logger.error(error, 'Rolling back transaction due to error');
    await tx.rollback();
    throw error;
  }
}

/**
 * Closes the database connection.
 */
export function close() {
  if (_dbClient) {
    _dbClient.close();
    _dbClient = undefined;
  }
}

// Create and export the db object that implements the Database interface
export const db: Database = {
  execute: async <T extends QueryRow>(
    sql: string,
    args?: readonly SqlValue[]
  ): Promise<QueryResult<T>> => execute<T>(sql, args),
  transaction: async <T>(fn: (tx: Database) => Promise<T>): Promise<T> => transaction<T>(fn),
  close: () => {
    close();
  },
};

// Initialize the database client
await initializeDbClient();
