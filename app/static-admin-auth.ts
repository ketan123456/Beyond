import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "../lib/server/runtime";
import { ensureDatabaseSchema } from "../db/runtime-schema";

export const ADMIN_COOKIE = "beyond_admin_session";

type AdminEnv = { DB?: D1Database; ADMIN_USERNAME?: string; ADMIN_PASSWORD?: string; ADMIN_SESSION_SECRET?: string };
type AdminCredentials = { username: string; passwordToken: string };

function adminConfig() {
  const bindings = env as unknown as AdminEnv;
  return { username: bindings.ADMIN_USERNAME?.trim() || "info@beyonddisability.org", password: bindings.ADMIN_PASSWORD || "Admin@123", sessionSecret: bindings.ADMIN_SESSION_SECRET || "beyond-local-admin-session-2026" };
}

export function configuredAdminUsername() {
  return adminConfig().username;
}

async function digest(value: string) {
  const hash = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function getAdminCredentials(): Promise<AdminCredentials> {
  const { username, password, sessionSecret } = adminConfig();
  const passwordToken = await digest(`${username}:${password}:${sessionSecret}`);
  const db = (env as unknown as AdminEnv).DB;
  if (!db) return { username, passwordToken };
  await ensureDatabaseSchema(db);
  const saved = await db.prepare("SELECT username,password_token FROM admin_credentials WHERE id = 1").first<{username:string;password_token:string}>();
  if (saved?.username === username) {
    return { username: saved.username, passwordToken: saved.password_token };
  }
  if (saved) {
    await db.prepare("UPDATE admin_credentials SET username = ?, password_token = ?, updated_at = ? WHERE id = 1").bind(username, passwordToken, Date.now()).run();
    return { username, passwordToken };
  }
  await db.prepare("INSERT INTO admin_credentials (id,username,password_token,updated_at) VALUES (1,?,?,?)").bind(username, passwordToken, Date.now()).run();
  return { username, passwordToken };
}

export async function expectedAdminToken() { return (await getAdminCredentials()).passwordToken; }

export async function validAdminCredentials(username: string, password: string) {
  const { sessionSecret } = adminConfig();
  const credentials = await getAdminCredentials();
  return (await digest(`${username}:${password}:${sessionSecret}`)) === credentials.passwordToken;
}

export async function isStaticAdmin() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === (await expectedAdminToken());
}

export async function requireStaticAdmin() {
  if (!(await isStaticAdmin())) redirect("/admin/login");
  return { displayName: (await getAdminCredentials()).username };
}
