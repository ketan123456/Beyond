import type { PortableDatabase } from "../lib/server/database";

/**
 * PostgreSQL schema management is explicit and portable. Run
 * `psql "$DATABASE_URL" -f db/schema.postgres.sql` before deployment.
 */
export async function ensureDatabaseSchema(_db: PortableDatabase) {
  void _db;
}
