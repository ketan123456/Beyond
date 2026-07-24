import { env } from "../../../../lib/server/runtime";
import { isStaticAdmin } from "../../../static-admin-auth";
import { ensureDatabaseSchema } from "../../../../db/runtime-schema";

type AdminSection = "applications" | "partners" | "payments" | "appointments";
const allowedStatuses: Record<AdminSection, string[]> = {
  applications: ["submitted", "reviewing", "documents-needed", "approved", "rejected", "supported"],
  partners: ["new", "contacted", "meeting", "committed", "closed"],
  payments: ["created", "paid", "failed", "refunded"],
  appointments: ["requested", "confirmed", "completed", "cancelled"],
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
    const [applications, partners, payments, appointments, documents, applicationDocuments] = await Promise.all([
      db.prepare("SELECT * FROM applications ORDER BY created_at DESC, id DESC").all(),
      db.prepare("SELECT * FROM partner_leads ORDER BY id DESC").all(),
      db.prepare("SELECT * FROM payments ORDER BY created_at DESC, id DESC").all(),
      db.prepare("SELECT * FROM appointments ORDER BY preferred_date DESC, preferred_time DESC, id DESC").all(),
      db.prepare("SELECT d.application_id, COUNT(*) AS total, SUM(CASE WHEN d.review_status = 'pending' AND a.status IN ('submitted','reviewing','documents-needed') THEN 1 ELSE 0 END) AS pending FROM documents d INNER JOIN applications a ON a.id = d.application_id GROUP BY d.application_id").all(),
      db.prepare("SELECT id,application_id,type,filename,review_status FROM documents ORDER BY id DESC").all(),
    ]);
    return Response.json({ applications: applications.results, partners: partners.results, payments: payments.results, appointments: appointments.results, documents: documents.results, applicationDocuments: applicationDocuments.results, refreshedAt: new Date().toISOString() });
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
  if (section === "applications") {
    const documentStatus =
      status === "approved" || status === "supported"
        ? "approved"
        : status === "rejected"
          ? "rejected"
          : "pending";
    await db.batch([
      db.prepare("UPDATE applications SET status = ? WHERE id = ?").bind(status, id),
      db.prepare("UPDATE documents SET review_status = ? WHERE application_id = ?").bind(documentStatus, id),
    ]);
    return Response.json({ ok: true });
  }
  const table = section === "partners" ? "partner_leads" : section;
  await db.prepare(`UPDATE ${table} SET status = ? WHERE id = ?`).bind(status, id).run();
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = database();
  if (!db) return Response.json({ error: "Database binding DB is not configured." }, { status: 503 });
  await ensureDatabaseSchema(db);
  const { section, id } = (await request.json()) as { section?: AdminSection; id?: number };
  if (!section || !id || !["applications", "partners", "payments", "appointments"].includes(section)) return Response.json({ error: "Invalid delete request." }, { status: 400 });
  try {
    if (section === "applications") {
      const files = await db.prepare("SELECT storage_key FROM documents WHERE application_id = ?").bind(id).all<{storage_key:string}>();
      const bucket = (env as unknown as { DOCUMENTS?: R2Bucket }).DOCUMENTS;
      if (bucket && files.results.length) await Promise.all(files.results.map(file => bucket.delete(file.storage_key)));
      await db.batch([db.prepare("DELETE FROM documents WHERE application_id = ?").bind(id),db.prepare("DELETE FROM applications WHERE id = ?").bind(id)]);
    } else {
      const table = section === "partners" ? "partner_leads" : section;
      await db.prepare(`DELETE FROM ${table} WHERE id = ?`).bind(id).run();
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("Admin record deletion failed", error);
    return Response.json({ error: "Unable to delete this record." }, { status: 500 });
  }
}
