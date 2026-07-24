import { readFile } from "node:fs/promises";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is required to run database migrations.");
}

const sql = await readFile(new URL("../db/schema.postgres.sql", import.meta.url), "utf8");
const client = new pg.Client({
  connectionString,
  ssl: process.env.DATABASE_SSL === "false" ? false : { rejectUnauthorized: false },
});

await client.connect();
try {
  await client.query(sql);
  console.log("PostgreSQL schema is ready.");
} finally {
  await client.end();
}
