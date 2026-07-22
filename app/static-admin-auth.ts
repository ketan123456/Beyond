import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "beyond_admin_session";
export const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
// Keep the local fallback aligned with .env.example. Production deployments
// should always provide ADMIN_PASSWORD as a secret environment variable.
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || "beyond-local-admin-session-2026";

async function digest(value: string) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function expectedAdminToken() {
  return digest(`${ADMIN_USERNAME}:${ADMIN_PASSWORD}:${SESSION_SECRET}`);
}

export async function validAdminCredentials(username: string, password: string) {
  return (await digest(`${username}:${password}:${SESSION_SECRET}`)) === (await expectedAdminToken());
}

export async function isStaticAdmin() {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === (await expectedAdminToken());
}

export async function requireStaticAdmin() {
  if (!(await isStaticAdmin())) redirect("/admin/login");
  return { displayName: ADMIN_USERNAME };
}
