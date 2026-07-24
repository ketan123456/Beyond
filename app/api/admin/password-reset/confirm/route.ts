import { env } from "cloudflare:workers";
import { ensureDatabaseSchema } from "../../../../../db/runtime-schema";
import { configuredAdminUsername } from "../../../../static-admin-auth";

type ResetEnv = {
  DB?: D1Database;
  ADMIN_SESSION_SECRET?: string;
};

async function hash(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

export async function POST(request: Request) {
  try {
    const { code, password } = (await request.json()) as {
      code?: string;
      password?: string;
    };
    if (!/^\d{6}$/.test(code || "") || !password || password.length < 10) {
      return Response.json(
        { error: "Enter the six-digit code and a password with at least 10 characters." },
        { status: 400 },
      );
    }
    const bindings = env as unknown as ResetEnv;
    if (!bindings.DB) {
      return Response.json({ error: "Password reset is unavailable." }, { status: 503 });
    }
    await ensureDatabaseSchema(bindings.DB);
    const now = Date.now();
    const reset = await bindings.DB
      .prepare("SELECT id,code_hash,attempts FROM admin_password_resets WHERE used_at IS NULL AND expires_at > ? ORDER BY id DESC LIMIT 1")
      .bind(now)
      .first<{ id: number; code_hash: string; attempts: number }>();
    if (!reset || reset.attempts >= 5) {
      return Response.json({ error: "This reset code is invalid or expired." }, { status: 400 });
    }
    const codeHash = await hash(
      `${code}:${bindings.ADMIN_SESSION_SECRET || "beyond-local-admin-session-2026"}`,
    );
    if (codeHash !== reset.code_hash) {
      await bindings.DB
        .prepare("UPDATE admin_password_resets SET attempts = attempts + 1 WHERE id = ?")
        .bind(reset.id)
        .run();
      return Response.json({ error: "This reset code is invalid or expired." }, { status: 400 });
    }

    const username = configuredAdminUsername();
    const passwordToken = await hash(
      `${username}:${password}:${bindings.ADMIN_SESSION_SECRET || "beyond-local-admin-session-2026"}`,
    );
    await bindings.DB.batch([
      bindings.DB
        .prepare("INSERT INTO admin_credentials (id,username,password_token,updated_at) VALUES (1,?,?,?) ON CONFLICT(id) DO UPDATE SET password_token = excluded.password_token, updated_at = excluded.updated_at")
        .bind(username, passwordToken, now),
      bindings.DB
        .prepare("UPDATE admin_password_resets SET used_at = ? WHERE id = ?")
        .bind(now, reset.id),
    ]);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Password reset confirmation failed", error);
    return Response.json({ error: "Unable to reset password. Please try again." }, { status: 500 });
  }
}
