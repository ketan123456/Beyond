# Beyond Disability Foundation

Production website for Beyond Disability Foundation, built as a portable
Next.js full-stack application.

## Development

```bash
npm install
npm run dev
npm test
```

`npm test` runs the production build.

## Deploy anywhere

1. Create a PostgreSQL database and private S3-compatible bucket.
2. Copy `.env.example` values to the host's encrypted environment settings.
3. Run the schema command once: `npm run db:migrate`.
4. Deploy with one of the following targets:

```bash
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --build --prod

# AWS, VPS, Render, Railway, or any Docker host
docker build -t beyond-disability .
docker run --env-file .env -p 3000:3000 beyond-disability
```

## Render (easiest)

1. Push this repository to GitHub and open the Render Dashboard.
2. Select **New +** → **Blueprint**, then choose this repository. Render reads
   `render.yaml`, creates the `beyond-disability-db` PostgreSQL database, and
   assigns its internal connection string to `DATABASE_URL` automatically.
3. In the Blueprint form, fill the values marked as secrets. Use the **Internal
   Database URL** only within Render; never paste a localhost URL into Render.
4. Deploy. The `preDeployCommand` runs `npm run db:migrate`, which applies
   `db/schema.postgres.sql` before the web service starts.

Render does not provide S3 object storage, so document uploads require a small
separate S3-compatible bucket (Cloudflare R2, AWS S3, or Backblaze B2). Add its
five `S3_*` values in the Render environment settings.

## Production services

This project is a portable Next.js application, not a static export. The full
feature set requires a Node.js runtime with a database, private object storage,
and environment secrets:

- **Database records and admin credentials:** PostgreSQL via `DATABASE_URL`
- **Document uploads:** S3-compatible private bucket variables (`S3_*`)
- **Payments:** `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`
- **Password-reset OTP email:** EmailJS variables (`EMAILJS_SERVICE_ID`,
  `EMAILJS_PUBLIC_KEY`, `EMAILJS_PRIVATE_KEY`, and
  `EMAILJS_ADMIN_TEMPLATE_ID`) plus `ADMIN_NOTIFICATION_EMAIL`
- **Admin sign-in:** `ADMIN_USERNAME`, `ADMIN_PASSWORD`, and a long random
  `ADMIN_SESSION_SECRET`

For local development, put those values in ignored `.env.local` and restart
`npm run dev` after changing them. For production, add the same values as
encrypted environment variables in the host dashboard; do not commit them to
the repository. `.env.example` contains placeholders only.

Vercel and Netlify run the app as Next.js serverless functions. AWS and a VPS
run the same app using Docker. A static-only host cannot run admin APIs,
password reset, database records, uploads, or payment verification.

## Portable PostgreSQL database

`db/schema.postgres.sql` is the complete schema for the portable Next.js
migration. It contains every current record type: admin credentials and reset
codes, applications, private documents, appointments, partner leads,
translations, Razorpay orders, plans, and subscriptions.

```bash
psql "$DATABASE_URL" -f db/schema.postgres.sql
```

## Project structure

- `app/` — pages, forms, admin dashboard, translations and API routes
- `db/` — application schema and runtime database setup
- `public/` — optimized website images and downloadable assets
- `lib/server/` — PostgreSQL and S3-compatible server adapters
- `db/schema.postgres.sql` — runnable production PostgreSQL schema
- `Dockerfile` — AWS/VPS/container deployment image
