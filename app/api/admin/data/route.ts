import { env } from "cloudflare:workers";
import { isStaticAdmin } from "../../../static-admin-auth";
import { ensureDatabaseSchema } from "../../../../db/runtime-schema";

type AdminSection = "applications" | "partners" | "payments";
const allowedStatuses: Record<AdminSection, string[]> = {
  applications: ["submitted", "reviewing", "documents-needed", "approved", "rejected", "supported"],
  partners: ["new", "contacted", "meeting", "committed", "closed"],
  payments: ["created", "paid", "failed", "refunded"],
};

function database() {
  return (env as unknown as { DB?: D1Database }).DB;
}

export async function GET() {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = database();
  if (!db) return Response.json({ error: "Database binding DB is not configured." }, { status: 503 });
  try {
    await ensureDatabaseSchema(db);
    const [applications, partners, payments, documents] = await Promise.all([
      db.prepare("SELECT * FROM applications ORDER BY created_at DESC, id DESC").all(),
      db.prepare("SELECT * FROM partner_leads ORDER BY id DESC").all(),
      db.prepare("SELECT * FROM payments ORDER BY created_at DESC, id DESC").all(),
      db.prepare("SELECT application_id, COUNT(*) AS total, SUM(CASE WHEN review_status = 'pending' THEN 1 ELSE 0 END) AS pending FROM documents GROUP BY application_id").all(),
    ]);
    return Response.json({ applications: applications.results, partners: partners.results, payments: payments.results, documents: documents.results, refreshedAt: new Date().toISOString() });
  } catch (error) {
    console.error("Admin data load failed", error);
    return Response.json({ error: "Unable to load admin data." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = database();
  if (!db) return Response.json({ error: "Database binding DB is not configured." }, { status: 503 });
  await ensureDatabaseSchema(db);
  const { section, id, status } = (await request.json()) as { section?: AdminSection; id?: number; status?: string };
  if (!section || !id || !status || !allowedStatuses[section]?.includes(status)) return Response.json({ error: "Invalid update." }, { status: 400 });
  const table = section === "applications" ? "applications" : section === "partners" ? "partner_leads" : "payments";
  await db.prepare(`UPDATE ${table} SET status = ? WHERE id = ?`).bind(status, id).run();
  return Response.json({ ok: true });
}
