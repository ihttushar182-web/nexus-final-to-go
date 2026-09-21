# 10 — Deployment

## 1. Environment

Copy `.env.example` to `.env.local` for development, and set real values in the hosting
provider for production. Never commit real secrets.

Minimum for a working production deployment:

| Variable | Why |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | absolute canonicals, OG URLs, sitemap |
| `AUTH_SECRET` | signs admin sessions (min 16 chars, required in production) |
| `ADMIN_EMAIL` + `ADMIN_PASSWORD_HASH` | admin sign-in (hash required in production) |
| `N8N_WEBHOOK_SECRET` | authenticates inbound automation (fails closed if unset) |
| contact vars | `NEXT_PUBLIC_CONTACT_EMAIL`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_PHONE_DISPLAY`, `NEXT_PUBLIC_FACEBOOK_URL` |

Generate the admin hash with:

```bash
node scripts/hash-password.mjs "your-strong-password"
```

> In production a plaintext `ADMIN_PASSWORD` is **refused** — this is deliberate, so a
> shared development password can never become a production credential.

## 2. Database choice

| Scenario | Setting |
| --- | --- |
| Preview, demo, one small instance | leave `DB_DRIVER=local` (no credentials needed) |
| Production with more than one instance | `DB_DRIVER=supabase` + `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` |

The local driver writes one JSON file and serialises writes in-process, so it must not be
used behind multiple instances or an ephemeral filesystem. If the Supabase client cannot
be constructed, the app logs the failure and falls back to the local store rather than
going down.

Apply the schema once:

```bash
psql "$DATABASE_URL" -f db/schema.sql
```

## 3. Build & run

```bash
npm ci
npm run verify        # typecheck + lint + tests + build
npm run start         # next start -p 3000
```

Node 22+ is expected. The build **must not** depend on network access: fonts are
self-hosted in `app/fonts/`, so `next build` works offline.

## 4. Hosting notes

- **Vercel:** import the repo, set the env vars, add both domains. Use the Supabase driver.
  Remember to expose the webhook routes publicly — they are secret-authenticated.
- **Any Node host (VPS/Docker):** `next build && next start`, bind `0.0.0.0`, run behind a
  reverse proxy with TLS. If you stay on the local driver, mount `LOCAL_DB_DIR` on
  persistent storage and run exactly one instance.

## 5. Post-deploy checklist

1. `GET /api/health` → `{"status":"ok"}`.
2. Sign in at `/admin` with the production password.
3. Submit the audit form end to end; confirm the result page and that a lead appears in
   `/admin/leads`.
4. Send a test webhook with the real secret; confirm it is accepted and appears in
   `/admin/messages`. Send one with a wrong secret and confirm `401`.
5. Confirm `robots.txt` and `sitemap.xml` show the production domain.
6. Confirm unknown catalogue URLs return `404` (not `200`).
7. Check that the WhatsApp CTA opens a chat with the production number.

## 6. Rollback

The app is stateless apart from the database. Roll back by redeploying the previous build;
no migration is needed unless `db/schema.sql` changed, in which case apply the additive
migration first and roll the app forward only.

## 7. Backups

- Supabase: point-in-time recovery.
- Local driver: back up `.data/nexus-lift.json` (single file, gitignored).

## 8. Fonts

`app/fonts/` contains the woff2 files and the @fontsource packages live in
`devDependencies`. If they ever go missing, run:

```bash
npm run fonts:sync
```

This is the only build-time asset step, and it needs no runtime network access.
