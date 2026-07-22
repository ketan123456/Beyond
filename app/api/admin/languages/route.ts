import { env } from "cloudflare:workers";
import { isStaticAdmin } from "../../../static-admin-auth";
import { ensureDatabaseSchema } from "../../../../db/runtime-schema";

const getDb = () => (env as unknown as { DB?: D1Database }).DB;
const validLocale = (value: string) => /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(value);

export async function GET() {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb();
  if (!db) return Response.json({ error: "Database binding DB is not configured." }, { status: 503 });
  await ensureDatabaseSchema(db);
  const [languages, counts] = await Promise.all([
    db.prepare("SELECT * FROM languages ORDER BY sort_order,name").all(),
    db.prepare("SELECT locale,COUNT(*) AS translation_count FROM translations GROUP BY locale").all(),
  ]);
  return Response.json({ languages: languages.results, counts: counts.results });
}

export async function POST(request: Request) {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb(); if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });
  await ensureDatabaseSchema(db);
  const body = await request.json() as { locale?: string; name?: string; nativeName?: string };
  const locale = body.locale?.trim() || "", name = body.name?.trim() || "", nativeName = body.nativeName?.trim() || "";
  if (!validLocale(locale) || !name || !nativeName) return Response.json({ error: "Enter a valid locale, name and native name." }, { status: 400 });
  const order = await db.prepare("SELECT COALESCE(MAX(sort_order),0)+1 AS next_order FROM languages").first<{ next_order: number }>();
  try { await db.prepare("INSERT INTO languages(locale,name,native_name,enabled,sort_order) VALUES(?,?,?,?,?)").bind(locale,name,nativeName,1,order?.next_order || 1).run(); }
  catch { return Response.json({ error: "That locale already exists." }, { status: 409 }); }
  return Response.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb(); if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });
  await ensureDatabaseSchema(db);
  const body = await request.json() as { locale?: string; name?: string; nativeName?: string; enabled?: boolean };
  const locale = body.locale?.trim() || "";
  if (!validLocale(locale)) return Response.json({ error: "Invalid locale." }, { status: 400 });
  if (locale === "en" && body.enabled === false) return Response.json({ error: "English is the required fallback language." }, { status: 400 });
  await db.prepare("UPDATE languages SET name=COALESCE(?,name),native_name=COALESCE(?,native_name),enabled=COALESCE(?,enabled) WHERE locale=?")
    .bind(body.name?.trim() || null, body.nativeName?.trim() || null, typeof body.enabled === "boolean" ? Number(body.enabled) : null, locale).run();
  return Response.json({ ok: true });
}

export async function DELETE(request: Request) {
  if (!(await isStaticAdmin())) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const db = getDb(); if (!db) return Response.json({ error: "Database unavailable" }, { status: 503 });
  await ensureDatabaseSchema(db);
  const locale = new URL(request.url).searchParams.get("locale") || "";
  if (locale === "en") return Response.json({ error: "English cannot be deleted." }, { status: 400 });
  await db.batch([db.prepare("DELETE FROM translations WHERE locale=?").bind(locale),db.prepare("DELETE FROM languages WHERE locale=?").bind(locale)]);
  return Response.json({ ok: true });
}
