import { createClient, type Client, type InArgs, type ResultSet } from '@libsql/client';

import config from './config';
import { ServiceUnavailableError } from './http/errors';
import logger from './logger';

type SqlValue = string | number | bigint | boolean | Uint8Array | ArrayBuffer | null;
type QueryRow = Record<string, unknown>;
type QueryResult<T extends QueryRow = QueryRow> = {
  rows: T[];
  rowsAffected: number;
};

export interface Database {
  execute<T extends QueryRow>(sql: string, args?: readonly SqlValue[]): Promise<QueryResult<T>>;
  transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T>;
  close(): void;
}

type SqliteDatabaseConfig = {
  url: string;
  authToken?: string;
};

class LibSqlDatabase implements Database {
  readonly #client: Client;

  private constructor(client: Client) {
    logger.info('Initializing database...');

    this.#client = client;
  }

  static async create(config: SqliteDatabaseConfig): Promise<LibSqlDatabase> {
    try {
      const client = createClient(config);
      const db = new LibSqlDatabase(client);

      await db.execute('SELECT 1');

      return db;
    } catch (error) {
      logger.error(error, 'Failed to initialize the database.');

      throw new ServiceUnavailableError();
    }
  }

  async #runQuery<T extends QueryRow>(
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

  async execute<T extends QueryRow>(
    sql: string,
    args?: readonly SqlValue[]
  ): Promise<QueryResult<T>> {
    return this.#runQuery<T>(this.#client, sql, args);
  }

  async transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T> {
    const tx = await this.#client.transaction();

    const database: Database = {
      execute: async <T extends QueryRow>(
        sql: string,
        args?: readonly SqlValue[]
      ): Promise<QueryResult<T>> => {
        return this.#runQuery<T>(tx, sql, args);
      },

      transaction: () => {
        throw new Error('Nested transactions are not supported');
      },

      close: () => {
        throw new Error('Cannot close transaction connection');
      },
    };

    try {
      const result = await fn(database);

      await tx.commit();

      return result;
    } catch (error) {
      logger.error(error, 'Rolling back transaction due to error');

      await tx.rollback();

      throw error;
    }
  }

  close() {
    this.#client.close();
  }
}

export const db = await LibSqlDatabase.create({
  url: config.databaseUrl,
  authToken: config.tursoAuthToken,
});
