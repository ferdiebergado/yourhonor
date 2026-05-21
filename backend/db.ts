import { createClient, type Client, type InArgs } from '@libsql/client';

import config from './config';

export type SqlValue = string | number | bigint | boolean | Uint8Array | ArrayBuffer | null;

export type QueryRow = Record<string, unknown>;

export type QueryResult<T extends QueryRow = QueryRow> = {
  rows: T[];
  rowsAffected: number;
};

export interface Database {
  execute<T extends QueryRow>(sql: string, args?: readonly SqlValue[]): Promise<QueryResult<T>>;

  transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T>;

  close(): void;
}

class SqliteDatabase implements Database {
  readonly #client: Client;

  private constructor(client: Client) {
    this.#client = client;
  }

  static async create(url: string, authToken?: string): Promise<SqliteDatabase> {
    const client = createClient({
      url,
      authToken,
    });

    const db = new SqliteDatabase(client);

    await db.execute('SELECT 1');

    return db;
  }

  async execute<T extends QueryRow>(
    sql: string,
    args?: readonly SqlValue[]
  ): Promise<QueryResult<T>> {
    const result = args
      ? await this.#client.execute({
          sql,
          args: args as InArgs,
        })
      : await this.#client.execute(sql);

    return {
      rows: result.rows as unknown as T[],
      rowsAffected: result.rowsAffected,
    };
  }

  async transaction<T>(fn: (tx: Database) => Promise<T>): Promise<T> {
    const tx = await this.#client.transaction();

    const database: Database = {
      execute: async <T extends QueryRow>(
        sql: string,
        args?: readonly SqlValue[]
      ): Promise<QueryResult<T>> => {
        const result = args
          ? await tx.execute({
              sql,
              args: args as InArgs,
            })
          : await tx.execute(sql);

        return {
          rows: result.rows as unknown as T[],
          rowsAffected: result.rowsAffected,
        };
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
      await tx.rollback();

      throw error;
    }
  }

  close() {
    this.#client.close();
  }
}

export const db = await SqliteDatabase.create(config.databaseUrl, config.tursoAuthToken);
