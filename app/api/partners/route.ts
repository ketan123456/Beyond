import { env } from "../../../lib/server/runtime";
import { ensureDatabaseSchema } from "../../../db/runtime-schema";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, string>;
    const enquiryType = body.enquiryType === "volunteer" ? "volunteer" : "partner";
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    if (!body.company?.trim() || !body.contactName?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\+?[0-9\s-]{10,16}$/.test(phone) || !body.message?.trim()) {
      return Response.json({ error: "Required fields missing" }, { status: 400 });
    }
    const db = (env as unknown as { DB?: D1Database }).DB;
    if (!db) return Response.json({ error: "Database is not configured" }, { status: 503 });
    await ensureDatabaseSchema(db);
    const storedMessage = `[${enquiryType === "volunteer" ? "Volunteer" : "Partnership"} enquiry]\n${body.message.trim()}`;
    await db.prepare(
      "INSERT INTO partner_leads (company,contact_name,email,phone,message,status,created_at) VALUES (?,?,?,?,?,?,CURRENT_TIMESTAMP)",
    ).bind(body.company.trim(), body.contactName.trim(), email, phone, storedMessage, "new").run();

    return Response.json({ ok: true, enquiryType });
  } catch (error) {
    console.error("Partner enquiry failed", error);
    return Response.json({ error: "Unable to save enquiry" }, { status: 500 });
  }
}
