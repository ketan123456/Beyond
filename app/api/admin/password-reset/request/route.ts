import { env } from "../../../../../lib/server/runtime";
import { ensureDatabaseSchema } from "../../../../../db/runtime-schema";
import { configuredAdminUsername } from "../../../../static-admin-auth";

type ResetEnv = {
  DB?: D1Database;
  EMAILJS_SERVICE_ID?: string;
  EMAILJS_PUBLIC_KEY?: string;
  EMAILJS_PRIVATE_KEY?: string;
  EMAILJS_PASSWORD_RESET_TEMPLATE_ID?: string;
  EMAILJS_ADMIN_TEMPLATE_ID?: string;
  ADMIN_NOTIFICATION_EMAIL?: string;
  ADMIN_SESSION_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
};

const RESET_LIFETIME_MS = 10 * 60 * 1000;
const RESET_INTERVAL_MS = 60 * 1000;

async function hash(value: string) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

function createCode() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return String(100000 + (bytes[0] % 900000));
}

async function sendResetEmail(
  bindings: ResetEnv,
  recipient: string,
  code: string,
) {
  const message = `Your one-time password reset code is ${code}. It expires in 10 minutes. If you did not request this, ignore this email.`;
  if (bindings.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${bindings.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: bindings.RESEND_FROM_EMAIL || "Beyond Disability <onboarding@resend.dev>",
        to: [recipient],
        subject: "Beyond Disability admin password reset",
        text: message,
        html: `<main style="font-family:Arial,sans-serif;color:#092b56"><h1>Admin password reset</h1><p>Your verification code is:</p><p style="font-size:32px;font-weight:700;letter-spacing:6px">${code}</p><p>This code expires in 10 minutes. If you did not request it, you can safely ignore this email.</p></main>`,
      }),
    });
    if (!response.ok) throw new Error(`Resend returned ${response.status}.`);
    return;
  }

  const templateId =
    bindings.EMAILJS_PASSWORD_RESET_TEMPLATE_ID ||
    bindings.EMAILJS_ADMIN_TEMPLATE_ID;
  if (!bindings.EMAILJS_SERVICE_ID || !bindings.EMAILJS_PUBLIC_KEY || !templateId) {
    throw new Error("Configure RESEND_API_KEY or EMAILJS_PASSWORD_RESET_TEMPLATE_ID to deliver reset emails.");
  }
  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      service_id: bindings.EMAILJS_SERVICE_ID,
      template_id: templateId,
      user_id: bindings.EMAILJS_PUBLIC_KEY,
      accessToken: bindings.EMAILJS_PRIVATE_KEY || undefined,
      template_params: {
        to_email: recipient,
        recipient_email: recipient,
        admin_email: recipient,
        subject: "Beyond Disability admin password reset",
        title: "Admin Password Reset",
        reset_code: code,
        verification_code: code,
        reference: "PASSWORD RESET",
        appointment_reference: "PASSWORD RESET",
        name: "Administrator",
        from_name: "Beyond Disability Foundation",
        email: recipient,
        from_email: recipient,
        user_email: recipient,
        phone: "Not applicable",
        phone_number: "Not applicable",
        date: new Date().toLocaleDateString("en-IN"),
        appointment_date: new Date().toLocaleDateString("en-IN"),
        time: new Date().toLocaleTimeString("en-IN"),
        appointment_time: new Date().toLocaleTimeString("en-IN"),
        service: "Admin password reset",
        appointment_type: "Admin password reset",
        message,
        appointment_message: message,
        appointment_details: message,
      },
    }),
  });
  if (!response.ok) throw new Error(`EmailJS returned ${response.status}.`);
}

export async function POST() {
  const bindings = env as unknown as ResetEnv;
  const genericResponse = Response.json({
    ok: true,
    message: "If password reset is available, a verification code has been sent.",
  });
  if (!bindings.DB) return genericResponse;

  try {
    await ensureDatabaseSchema(bindings.DB);
    const username = configuredAdminUsername();
    const recipient = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)
      ? username
      : bindings.ADMIN_NOTIFICATION_EMAIL;
    if (!recipient) return Response.json({ error: "No administrator email is configured." }, { status: 503 });
    const hasResend = Boolean(bindings.RESEND_API_KEY);
    const hasEmailJs = Boolean(
      bindings.EMAILJS_SERVICE_ID &&
      bindings.EMAILJS_PUBLIC_KEY &&
      (bindings.EMAILJS_PASSWORD_RESET_TEMPLATE_ID ||
        bindings.EMAILJS_ADMIN_TEMPLATE_ID),
    );
    if (!hasResend && !hasEmailJs) {
      return Response.json(
        { error: "Email delivery is not configured. Add RESEND_API_KEY to .dev.vars, then restart the dev server." },
        { status: 503 },
      );
    }
    const now = new Date();
    const recent = await bindings.DB
      .prepare("SELECT requested_at FROM admin_password_resets ORDER BY id DESC LIMIT 1")
      .first<{ requested_at: Date | string }>();
    if (recent && Date.now() - new Date(recent.requested_at).getTime() < RESET_INTERVAL_MS) {
      return genericResponse;
    }

    const code = createCode();
    const codeHash = await hash(
      `${code}:${bindings.ADMIN_SESSION_SECRET || "beyond-local-admin-session-2026"}`,
    );
    await bindings.DB
      .prepare("INSERT INTO admin_password_resets (code_hash,expires_at,requested_at) VALUES (?,?,?)")
      .bind(codeHash, new Date(now.getTime() + RESET_LIFETIME_MS), now)
      .run();
    await bindings.DB
      .prepare("DELETE FROM admin_password_resets WHERE expires_at < ? OR used_at IS NOT NULL")
      .bind(now)
      .run();

    await sendResetEmail(bindings, recipient, code);
    return genericResponse;
  } catch (error) {
    console.error("Password reset request failed", error);
    return Response.json({ error: "Unable to start password reset. Please try again." }, { status: 500 });
  }
}
