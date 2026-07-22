import { env } from "cloudflare:workers";

const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png"]);
const maxFileSize = 8 * 1024 * 1024;

async function ensureApplicationTables(db: D1Database) {
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, reference TEXT NOT NULL UNIQUE, name TEXT NOT NULL, phone TEXT NOT NULL, district TEXT NOT NULL, category TEXT NOT NULL, details TEXT DEFAULT '' NOT NULL, status TEXT DEFAULT 'submitted' NOT NULL, created_at TEXT DEFAULT CURRENT_TIMESTAMP NOT NULL)"),
    db.prepare("CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, application_id INTEGER NOT NULL, type TEXT NOT NULL, storage_key TEXT NOT NULL, filename TEXT NOT NULL, review_status TEXT DEFAULT 'pending' NOT NULL)"),
  ]);
}

export async function POST(request: Request) {
  try {
    const form = await request.formData();
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").replace(/\s+/g, "");
    const district = String(form.get("district") || "").trim();
    const category = String(form.get("category") || "").trim();
    const details = String(form.get("details") || "").trim();
    const files = ["udid", "income"].map(type => ({ type, file: form.get(type) }));

    if (!name || !/^\+?[0-9]{10,13}$/.test(phone) || !district || !category) {
      return Response.json({ ok: false, error: "Please enter a valid name, mobile number, district, and support type." }, { status: 400 });
    }
    for (const { file } of files) {
      if (!(file instanceof File) || !file.size) return Response.json({ ok: false, error: "Please upload both required documents." }, { status: 400 });
      if (file.size > maxFileSize) return Response.json({ ok: false, error: "Each document must be smaller than 8 MB." }, { status: 400 });
      if (!allowedTypes.has(file.type)) return Response.json({ ok: false, error: "Documents must be PDF, JPG, or PNG files." }, { status: 400 });
    }

    const bindings = env as unknown as { DB?: D1Database; DOCUMENTS?: R2Bucket };
    if (!bindings.DB || !bindings.DOCUMENTS) throw new Error("Application storage bindings are unavailable");
    await ensureApplicationTables(bindings.DB);

    const reference = `BD-${Date.now().toString(36).toUpperCase()}`;
    const inserted = await bindings.DB.prepare("INSERT INTO applications (reference,name,phone,district,category,details,status) VALUES (?,?,?,?,?,?,?) RETURNING id")
      .bind(reference, name, phone, district, category, details, "submitted").first<{ id: number }>();
    if (!inserted?.id) throw new Error("Application record was not created");

    for (const { type, file } of files as { type: string; file: File }[]) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
      const key = `applications/${reference}/${type}-${safeName}`;
      await bindings.DOCUMENTS.put(key, file.stream(), { httpMetadata: { contentType: file.type } });
      await bindings.DB.prepare("INSERT INTO documents (application_id,type,storage_key,filename,review_status) VALUES (?,?,?,?,?)")
        .bind(inserted.id, type, key, file.name, "pending").run();
    }
    return Response.json({ ok: true, reference });
  } catch (error) {
    console.error("Application submission failed", error);
    return Response.json({ ok: false, error: "We could not save the application. Please try again." }, { status: 500 });
  }
}
