export async function ensureDatabaseSchema(db: D1Database) {
  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS applications (id INTEGER PRIMARY KEY AUTOINCREMENT, reference TEXT NOT NULL UNIQUE, name TEXT NOT NULL, phone TEXT NOT NULL, district TEXT NOT NULL, category TEXT NOT NULL, details TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'submitted', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS documents (id INTEGER PRIMARY KEY AUTOINCREMENT, application_id INTEGER NOT NULL, type TEXT NOT NULL, storage_key TEXT NOT NULL, filename TEXT NOT NULL, review_status TEXT NOT NULL DEFAULT 'pending')"),
    db.prepare("CREATE TABLE IF NOT EXISTS partner_leads (id INTEGER PRIMARY KEY AUTOINCREMENT, company TEXT NOT NULL, contact_name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL DEFAULT '', message TEXT NOT NULL DEFAULT '', status TEXT NOT NULL DEFAULT 'new', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS payments (id INTEGER PRIMARY KEY AUTOINCREMENT, razorpay_order_id TEXT NOT NULL UNIQUE, amount INTEGER NOT NULL, currency TEXT NOT NULL DEFAULT 'INR', status TEXT NOT NULL DEFAULT 'created', created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS languages (id INTEGER PRIMARY KEY AUTOINCREMENT, locale TEXT NOT NULL UNIQUE, name TEXT NOT NULL, native_name TEXT NOT NULL, enabled INTEGER NOT NULL DEFAULT 1, sort_order INTEGER NOT NULL DEFAULT 0, created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE TABLE IF NOT EXISTS translations (id INTEGER PRIMARY KEY AUTOINCREMENT, locale TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP)"),
    db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS translations_locale_key_unique ON translations(locale, key)"),
  ]);
  const partnerColumns = await db.prepare("PRAGMA table_info(partner_leads)").all<{name:string}>();
  const partnerColumnNames = new Set(partnerColumns.results.map(column=>column.name));
  if (!partnerColumnNames.has("phone")) await db.prepare("ALTER TABLE partner_leads ADD COLUMN phone TEXT NOT NULL DEFAULT ''").run();
  if (!partnerColumnNames.has("created_at")) await db.prepare("ALTER TABLE partner_leads ADD COLUMN created_at TEXT").run();
  // Older versions stored the phone as the first line of message. Split those
  // records once so existing enquiries display correctly in the admin panel.
  await db.prepare("UPDATE partner_leads SET phone = TRIM(SUBSTR(message,1,INSTR(message,CHAR(10))-1)), message = LTRIM(SUBSTR(message,INSTR(message,CHAR(10))+1),CHAR(10)||CHAR(13)||' ') WHERE phone = '' AND INSTR(message,CHAR(10)) > 1").run();
  await db.prepare("INSERT OR IGNORE INTO languages (locale,name,native_name,enabled,sort_order) VALUES ('en','English','English',1,0),('hi','Hindi','हिन्दी',1,1),('mr','Marathi','मराठी',1,2),('ta','Tamil','தமிழ்',1,3),('bn','Bengali','বাংলা',1,4)").run();
}
