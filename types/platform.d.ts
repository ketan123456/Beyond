import type { PortableDatabase } from "../lib/server/database";
import type { DocumentStorage } from "../lib/server/storage";

declare global {
  type D1Database = PortableDatabase;
  type R2Bucket = DocumentStorage;
}

export {};
