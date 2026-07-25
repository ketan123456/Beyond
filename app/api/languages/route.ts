import { env } from "../../../lib/server/runtime";
import { ensureDatabaseSchema } from "../../../db/runtime-schema";

export async function GET() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) return Response.json({ languages: [], translations: {} });
  await ensureDatabaseSchema(db);
  const [languageRows, translationRows] = await Promise.all([
    db.prepare("SELECT locale,name,native_name,sort_order FROM languages WHERE enabled = TRUE ORDER BY sort_order,name").all<Record<string, string | number>>(),
    db.prepare("SELECT locale,key,value FROM translations WHERE locale IN (SELECT locale FROM languages WHERE enabled = TRUE)").all<Record<string, string>>(),
  ]);
  const translations: Record<string, Record<string, string>> = {};
  for (const row of translationRows.results) (translations[row.locale] ??= {})[row.key] = row.value;
  return Response.json({ languages: languageRows.results, translations });
}
