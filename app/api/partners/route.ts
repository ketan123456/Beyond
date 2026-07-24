import { env } from "../../../lib/server/runtime";
import { ensureDatabaseSchema } from "../../../db/runtime-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>;
    if (!body.company || !body.contactName || !body.email || !body.phone || !body.message) {
      return Response.json({ error: "Required fields missing" }, { status: 400 });
    }
    const db = (env as unknown as { DB?: D1Database }).DB;
    if (!db) return Response.json({ error: "Database is not configured" }, { status: 503 });
    await ensureDatabaseSchema(db);
    await db.prepare(
      "INSERT INTO partner_leads (company,contact_name,email,phone,message,status,created_at) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)",
    ).bind(body.company, body.contactName, body.email, body.phone, body.message, "new").run();

    return Response.json({ ok: true });
  } catch (error) {
    console.error("Partner enquiry failed", error);
    return Response.json({ error: "Unable to save enquiry" }, { status: 500 });
  }
}
