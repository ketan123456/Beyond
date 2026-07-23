# Beyond Disability Foundation

Production website for Beyond Disability Foundation, built with Vinext and
deployed on OpenAI Sites.

## Development

```bash
npm install
npm run dev
npm test
```

`npm test` runs the production build. Database schema changes are generated with
`npm run db:generate`.

## Project structure

- `app/` — pages, forms, admin dashboard, translations and API routes
- `db/` — application schema and runtime database setup
- `drizzle/` — database migrations
- `public/` — optimized website images and downloadable assets
- `worker/` — production worker entry point
- `.openai/hosting.json` — Sites bindings and project configuration
