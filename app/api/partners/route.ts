import { env } from "cloudflare:workers";
import { ensureDatabaseSchema } from "../../../db/runtime-schema";
import { safelySendAdminEmail, safelySendUserEmail } from "../../admin-email";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>;
    if (!body.company || !body.contactName || !body.email || !body.phone || !body.message) {
      return Response.json({ error: "Required fields missing" }, { status: 400 });
    }
    const db = (env as unknown as { DB?: D1Database }).DB;
    if (!db) return Response.json({ error: "Database is not configured" }, { status: 503 });
    await ensureDatabaseSchema(db);
    const result = await db.prepare(
      "INSERT INTO partner_leads (company,contact_name,email,phone,message,status,created_at) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)",
    ).bind(body.company, body.contactName, body.email, body.phone, body.message, "new").run();

    await safelySendAdminEmail({
      subject: `New partner enquiry — ${body.company}`,
      heading: "New partner enquiry",
      summary: "A potential partner has submitted a CSR enquiry.",
      fields: [
        ["Organisation", body.company],
        ["Contact person", body.contactName],
        ["Email", body.email],
        ["Phone", body.phone],
      ],
      idempotencyKey: `partner-${result.meta.last_row_id}`,
    });
    await safelySendUserEmail(body.email, {
      subject: "We received your CSR enquiry",
      heading: "We’ve received your enquiry!",
      summary: `Hi ${body.contactName}, thank you for reaching out. Our CSR team will review your enquiry and reply within two working days.`,
      fields: [
        ["Organisation", body.company],
        ["Contact person", body.contactName],
        ["Phone", body.phone],
        ["Status", "Received"],
      ],
      idempotencyKey: `partner-user-${result.meta.last_row_id}`,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Partner enquiry failed", error);
    return Response.json({ error: "Unable to save enquiry" }, { status: 500 });
  }
}
