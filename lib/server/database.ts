import { Pool, type QueryResultRow } from "pg";

type QueryResult<T extends QueryResultRow> = { results: T[] };

function toPostgresSql(sql: string) {
  let parameter = 0;
  return sql.replace(/\?/g, () => `$${++parameter}`);
}

class Statement {
  private values: unknown[] = [];

  constructor(
    private readonly pool: Pool,
    private readonly sql: string,
  ) {}

  bind(...values: unknown[]) {
    this.values = values;
    return this;
  }

  async all<T extends QueryResultRow = QueryResultRow>(): Promise<QueryResult<T>> {
    const result = await this.pool.query<T>(toPostgresSql(this.sql), this.values);
    return { results: result.rows };
  }

  async first<T extends QueryResultRow = QueryResultRow>(): Promise<T | null> {
    const result = await this.pool.query<T>(toPostgresSql(this.sql), this.values);
    return result.rows[0] ?? null;
  }

  async run() {
    const result = await this.pool.query(toPostgresSql(this.sql), this.values);
    return { success: true, meta: { changes: result.rowCount ?? 0 } };
  }
}

export type PortableDatabase = {
  prepare(sql: string): Statement;
  batch(statements: Statement[]): Promise<unknown[]>;
};

let pool: Pool | undefined;

function getPool() {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return undefined;
  pool ??= new Pool({
    connectionString,
    ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
    max: 5,
  });
  return pool;
}

export function getDatabase(): PortableDatabase | undefined {
  const activePool = getPool();
  if (!activePool) return undefined;
  return {
    prepare(sql) {
      return new Statement(activePool, sql);
    },
    async batch(statements) {
      const client = await activePool.connect();
      try {
        await client.query("BEGIN");
        const results = [];
        for (const statement of statements) {
          results.push(await statement.run());
        }
        await client.query("COMMIT");
        return results;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
}
