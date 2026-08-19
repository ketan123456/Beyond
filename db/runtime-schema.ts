import type { PortableDatabase } from "../lib/server/database";

const schemaStatements = [
  `CREATE TABLE IF NOT EXISTS admin_credentials (
    id SMALLINT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    username TEXT NOT NULL,
    password_token TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS admin_password_resets (
    id BIGSERIAL PRIMARY KEY,
    code_hash TEXT NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    attempts SMALLINT NOT NULL DEFAULT 0 CHECK (attempts >= 0 AND attempts <= 5),
    used_at TIMESTAMPTZ,
    requested_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS admin_password_resets_active_idx
    ON admin_password_resets (expires_at DESC)
    WHERE used_at IS NULL`,
  `CREATE TABLE IF NOT EXISTS applications (
    id BIGSERIAL PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    district TEXT NOT NULL,
    category TEXT NOT NULL,
    details TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'submitted'
      CHECK (status IN ('submitted', 'reviewing', 'documents-needed', 'approved', 'rejected', 'supported')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS applications_created_at_idx
    ON applications (created_at DESC, id DESC)`,
  `CREATE TABLE IF NOT EXISTS documents (
    id BIGSERIAL PRIMARY KEY,
    application_id BIGINT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('udid', 'income')),
    storage_key TEXT NOT NULL UNIQUE,
    filename TEXT NOT NULL,
    content_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL CHECK (size_bytes > 0),
    review_status TEXT NOT NULL DEFAULT 'pending'
      CHECK (review_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (application_id, type)
  )`,
  `CREATE INDEX IF NOT EXISTS documents_application_id_idx ON documents (application_id)`,
  `CREATE TABLE IF NOT EXISTS partner_leads (
    id BIGSERIAL PRIMARY KEY,
    company TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'new'
      CHECK (status IN ('new', 'contacted', 'meeting', 'committed', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id BIGSERIAL PRIMARY KEY,
    reference TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    service TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'requested'
      CHECK (status IN ('requested', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE INDEX IF NOT EXISTS appointments_schedule_idx
    ON appointments (preferred_date DESC, preferred_time DESC, id DESC)`,
  `CREATE TABLE IF NOT EXISTS payments (
    id BIGSERIAL PRIMARY KEY,
    razorpay_order_id TEXT NOT NULL UNIQUE,
    razorpay_payment_id TEXT UNIQUE,
    amount INTEGER NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created'
      CHECK (status IN ('created', 'paid', 'failed', 'refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS razorpay_plan_cache (
    amount INTEGER PRIMARY KEY CHECK (amount > 0),
    razorpay_plan_id TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS recurring_donations (
    id BIGSERIAL PRIMARY KEY,
    razorpay_subscription_id TEXT NOT NULL UNIQUE,
    razorpay_plan_id TEXT NOT NULL,
    amount INTEGER NOT NULL CHECK (amount > 0),
    currency CHAR(3) NOT NULL DEFAULT 'INR',
    status TEXT NOT NULL DEFAULT 'created',
    razorpay_payment_id TEXT UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS languages (
    locale TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    native_name TEXT NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
  )`,
  `CREATE TABLE IF NOT EXISTS translations (
    locale TEXT NOT NULL REFERENCES languages(locale) ON DELETE CASCADE,
    key TEXT NOT NULL,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (locale, key)
  )`,
  `INSERT INTO languages (locale, name, native_name, enabled, sort_order)
    VALUES
      ('en', 'English', 'English', TRUE, 0),
      ('hi', 'Hindi', 'हिन्दी', TRUE, 1),
      ('mr', 'Marathi', 'मराठी', TRUE, 2),
      ('ta', 'Tamil', 'தமிழ்', TRUE, 3),
      ('bn', 'Bengali', 'বাংলা', TRUE, 4)
    ON CONFLICT (locale) DO NOTHING`,
];

let schemaReady: Promise<void> | undefined;

export async function ensureDatabaseSchema(db: PortableDatabase) {
  schemaReady ??= (async () => {
    for (const statement of schemaStatements) {
      await db.prepare(statement).run();
    }
  })();
  await schemaReady;
}
