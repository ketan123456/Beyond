import { env } from "../../../lib/server/runtime";
import { ensureDatabaseSchema } from "../../../db/runtime-schema";

const validLocale = (value: string) => /^[a-z]{2,3}(?:-[A-Z]{2})?$/.test(value);
let providerBlockedUntil = 0;

function chunks(text: string) {
  const parts = text.match(/[^.!?।]+[.!?।]?\s*/gu) || [text];
  const result: string[] = [];
  for (const part of parts) {
    if (new TextEncoder().encode(part).length <= 450) result.push(part);
    else {
      let current = "";
      for (const character of Array.from(part)) {
        if (new TextEncoder().encode(current + character).length > 450) { result.push(current); current = character; }
        else current += character;
      }
      if (current) result.push(current);
    }
  }
  return result;
}

async function machineTranslate(text: string, locale: string) {
  const translated: string[] = [];
  for (const part of chunks(text)) {
    const url = new URL("https://api.mymemory.translated.net/get");
    url.searchParams.set("q", part);
    url.searchParams.set("langpair", `en|${locale}`);
    url.searchParams.set("de", "info@beyonddisability.org");
    const response = await fetch(url, { headers: { accept: "application/json" } });
    if (response.status === 429) { providerBlockedUntil = Date.now() + 15 * 60 * 1000; throw new Error("RATE_LIMITED"); }
    if (!response.ok) throw new Error(`Translation provider returned ${response.status}`);
    const data = await response.json() as { responseStatus?: number; responseData?: { translatedText?: string } };
    const value = data.responseData?.translatedText?.trim();
    if (!value || (data.responseStatus && data.responseStatus !== 200)) throw new Error("Translation provider returned no translation");
    translated.push(value);
  }
  return translated.join(" ");
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { locale?: string; texts?: string[] };
    const locale = body.locale?.trim() || "";
    const texts = [...new Set((body.texts || []).map(value => String(value).trim()).filter(Boolean))].slice(0, 12);
    if (!validLocale(locale) || locale === "en" || !texts.length) return Response.json({ error: "Invalid translation request." }, { status: 400 });
    const db = (env as unknown as { DB?: D1Database }).DB;
    if (!db) return Response.json({ error: "Translation database is unavailable." }, { status: 503 });
    await ensureDatabaseSchema(db);
    const enabled = await db.prepare("SELECT locale FROM languages WHERE locale=? AND enabled=1").bind(locale).first();
    if (!enabled) return Response.json({ error: "That language is not enabled." }, { status: 400 });

    const translations: Record<string, string> = {};
    let limited = Date.now() < providerBlockedUntil;
    for (const text of texts) {
      const cached = await db.prepare("SELECT value FROM translations WHERE locale=? AND key=?").bind(locale, text).first<{ value: string }>();
      if (cached?.value) { translations[text] = cached.value; continue; }
      if (limited) continue;
      try {
        const value = await machineTranslate(text, locale);
        translations[text] = value;
        await db.prepare("INSERT INTO translations(locale,key,value,updated_at) VALUES(?,?,?,CURRENT_TIMESTAMP) ON CONFLICT(locale,key) DO UPDATE SET value=excluded.value,updated_at=CURRENT_TIMESTAMP")
          .bind(locale, text, value).run();
      } catch (error) {
        if (error instanceof Error && error.message === "RATE_LIMITED") { limited = true; continue; }
        console.warn("Translation skipped:", error instanceof Error ? error.message : "provider unavailable");
      }
    }
    return Response.json({ translations, limited, retryAfterSeconds: limited ? 900 : 0 });
  } catch (error) {
    console.error("Automatic translation failed", error);
    return Response.json({ error: "Automatic translation is temporarily unavailable." }, { status: 502 });
  }
}
