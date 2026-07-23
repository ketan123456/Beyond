import { env } from "cloudflare:workers";

type AdminEmail = {
  subject: string;
  heading: string;
  summary: string;
  fields: Array<[string, string]>;
  idempotencyKey: string;
  recipient?: string;
  userFacing?: boolean;
};

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] || character);

export async function sendAdminEmail(message: AdminEmail) {
  const bindings = env as unknown as {
    RESEND_API_KEY?: string;
    ADMIN_NOTIFICATION_EMAIL?: string;
    EMAIL_FROM?: string;
  };
  const apiKey = bindings.RESEND_API_KEY?.trim();
  const recipient = message.recipient?.trim() || bindings.ADMIN_NOTIFICATION_EMAIL?.trim();
  const sender = bindings.EMAIL_FROM?.trim();

  if (!apiKey || !recipient || !sender) {
    console.warn("Admin email skipped: RESEND_API_KEY, ADMIN_NOTIFICATION_EMAIL, or EMAIL_FROM is missing.");
    return false;
  }

  const rows = message.fields.map(([label, value]) => `
    <tr>
      <td style="padding:9px 12px;color:#5d7185;font-weight:600;border-bottom:1px solid #e4edf3">${escapeHtml(label)}</td>
      <td style="padding:9px 12px;color:#0b2d4d;border-bottom:1px solid #e4edf3">${escapeHtml(value)}</td>
    </tr>`).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
    },
    body: JSON.stringify({
      from: sender,
      to: [recipient],
      subject: message.subject,
      html: `
        <div style="background:#f3f8fb;padding:30px;font-family:Arial,sans-serif">
          <div style="max-width:640px;margin:auto;background:#fff;border-radius:18px;overflow:hidden;border:1px solid #dce8ef">
            <div style="background:#062f52;padding:24px 28px;color:#fff">
              <div style="display:flex;align-items:center;gap:12px">
                <span style="display:inline-block;background:#ffbd18;color:#062f52;border-radius:50%;padding:10px;font-size:22px;font-weight:800">∞</span>
                <div><div style="color:#ffbd18;font-size:19px;font-weight:800;letter-spacing:1.5px">BEYOND</div><div style="font-size:9px;font-weight:700;letter-spacing:1px">DISABILITY FOUNDATION</div></div>
              </div>
              <h1 style="font-size:24px;margin:8px 0 0">${escapeHtml(message.heading)}</h1>
            </div>
            <div style="padding:26px 28px">
              <p style="margin:0 0 18px;color:#425d73;line-height:1.6">${escapeHtml(message.summary)}</p>
              <table style="width:100%;border-collapse:collapse;border:1px solid #e4edf3;border-radius:10px">${rows}</table>
              <div style="margin:22px 0 0;padding:14px 16px;border-radius:10px;background:#f3f8fb;color:#526b7f;font-size:13px">
                ${message.userFacing
                  ? "Thank you for connecting with Beyond Disability Foundation. Keep this email for your records."
                  : "Open the secure admin dashboard to review the complete record and documents."}
              </div>
            </div>
            <div style="background:#062f52;padding:18px 28px;color:#fff;font-size:12px;line-height:1.6">
              <strong style="color:#ffbd18">♥ BEYOND DISABILITY FOUNDATION</strong><br/>
              +91 80000 12345 &nbsp; | &nbsp; info@beyonddisability.org<br/>
              Building an inclusive India, one family at a time.
            </div>
          </div>
        </div>`,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend returned ${response.status}: ${await response.text()}`);
  }
  return true;
}

export async function safelySendAdminEmail(message: AdminEmail) {
  try {
    return await sendAdminEmail(message);
  } catch (error) {
    console.error("Admin email delivery failed", error);
    return false;
  }
}

export async function safelySendUserEmail(recipient: string, message: Omit<AdminEmail, "recipient" | "userFacing">) {
  return safelySendAdminEmail({ ...message, recipient, userFacing: true });
}
