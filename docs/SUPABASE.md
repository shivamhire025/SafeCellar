# Supabase setup for SafeCellar

SafeCellar ships with Supabase client helpers, SQL migrations, and auth routes. By default the app runs in **demo mode** (in-memory data, no database). Follow this guide to connect a Supabase project.

## Prerequisites

- [Supabase account](https://supabase.com/dashboard)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (optional, for local Supabase via CLI)
- Node.js 18+

Install the Supabase CLI (one-time):

```bash
brew install supabase/tap/supabase
```

Or use `npx supabase` via the npm scripts below (no global install required).

## Option A — Hosted project (recommended)

### 1. Create a project

1. [Supabase Dashboard](https://supabase.com/dashboard) → **New project**
2. Choose a region and database password; wait for the project to finish provisioning.

### 2. Apply migrations

**Using the CLI (linked project):**

```bash
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
npm run supabase:db:push
```

**Or manually:** open **SQL Editor** in the dashboard and run, in order:

1. `supabase/migrations/001_initial_schema.sql`
2. `supabase/migrations/002_rls_and_storage.sql`

### 3. Environment variables

Dashboard → **Project Settings** → **API**:

| Variable | Where to copy |
|----------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` key |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` key (server only — never expose to the browser) |

Create `.env.local` from the template:

```bash
cp .env.example .env.local
```

Set:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_DEMO_MODE=false
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Restart `npm run dev` after changing env vars.

### 4. Auth redirect URLs

Dashboard → **Authentication** → **URL configuration**:

- **Site URL:** `http://localhost:3000` (and your Vercel URL in production)
- **Redirect URLs:** add `http://localhost:3000/**` and your production domain

### 5. Verify

1. Open [http://localhost:3000/signup](http://localhost:3000/signup) and create an account (creates org + admin profile).
2. Sign in at `/login`.
3. In Supabase **Table Editor**, confirm `organizations`, `profiles`, and `auth.users` rows exist.

## Option B — Local Supabase (Docker)

```bash
npm run supabase:start
npm run supabase:status
```

Copy **API URL**, **anon key**, and **service_role key** from the status output into `.env.local` (use `http://127.0.0.1:54321` as the URL). Set `NEXT_PUBLIC_DEMO_MODE=false`.

Migrations run automatically on `supabase start`. To reset the local DB:

```bash
npm run supabase:db:reset
```

Stop local services:

```bash
npm run supabase:stop
```

## npm scripts

| Script | Description |
|--------|-------------|
| `npm run supabase:start` | Start local Supabase (Docker) |
| `npm run supabase:stop` | Stop local stack |
| `npm run supabase:status` | Print local URLs and keys |
| `npm run supabase:db:push` | Push migrations to linked remote project |
| `npm run supabase:db:reset` | Reset local DB and re-run migrations + seed |
| `npm run supabase:link` | Link CLI to a hosted project |

## Project layout

| Path | Purpose |
|------|---------|
| `supabase/config.toml` | Local CLI config (auth URLs, `sds-files` bucket) |
| `supabase/migrations/` | Schema + RLS + storage policies |
| `lib/supabase/client.ts` | Browser client |
| `lib/supabase/server.ts` | Server Components / Route Handlers |
| `lib/supabase/middleware.ts` | Session refresh + route protection |
| `lib/supabase/admin.ts` | Service-role client (signup, admin tasks) |
| `lib/demo-mode.ts` | Demo vs live mode switch |

## Demo vs live mode

| `NEXT_PUBLIC_DEMO_MODE` | Supabase URL | Behavior |
|-------------------------|--------------|----------|
| `true` (default) | any | In-memory demo store |
| `false` | real project URL + keys | Supabase Auth + Postgres + storage |

If `NEXT_PUBLIC_DEMO_MODE` is unset, demo mode stays on until valid Supabase env vars are present.

## Storage (SDS PDFs)

Private bucket **`sds-files`**. Upload paths should be:

```text
{organization_id}/{chemical_id}/sds.pdf
```

RLS restricts access to the signed-in user’s organization.

## Production (Vercel)

1. Add the same Supabase env vars in Vercel → **Environment Variables**.
2. Set `NEXT_PUBLIC_DEMO_MODE=false`.
3. Add your `*.vercel.app` URL to Supabase Auth redirect allow-list.
4. Run migrations on the production Supabase project before go-live.

See also [VERCEL.md](./VERCEL.md).

## Marcus Chen demo account (production)

A **real Supabase login** (not in-memory demo mode) with the full sample inventory:

| Field | Value |
|-------|--------|
| Email | `demo@safecellar.app` |
| Organization | Cascade Creek Brewery |
| User | Marcus Chen (admin) |

### Option A — Run locally against production Supabase

1. Put production `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.
2. Optional: `MARCUS_DEMO_PASSWORD=YourSecurePassword` (default `CascadeCreek2025!`).
3. Run:

```bash
npm install
npm run seed:marcus
```

4. Sign in at your Vercel URL with that email and password (`NEXT_PUBLIC_DEMO_MODE` must stay `false`).

### Option B — Trigger from Vercel (one-time)

1. Add Vercel env vars: `SEED_MARCUS_SECRET` (long random string), optional `MARCUS_DEMO_PASSWORD`.
2. Redeploy, then:

```bash
curl -X POST "https://YOUR-APP.vercel.app/api/admin/seed-marcus" \
  -H "x-seed-secret: YOUR_SEED_MARCUS_SECRET" \
  -H "Content-Type: application/json" \
  -d '{"password":"YourSecurePassword"}'
```

Re-running is safe: existing users get a password reset; sample data is only inserted if the org has **zero** chemicals.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Still in demo mode after setting keys | Set `NEXT_PUBLIC_DEMO_MODE=false` and restart dev server |
| Signup fails “service role not configured” | Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local` |
| Redirect loop on login | Check Auth URL configuration and `NEXT_PUBLIC_APP_URL` |
| RLS errors on read | Ensure `profiles.organization_id` is set for the user |
| `supabase start` fails | Start Docker Desktop; ports 54321–54324 must be free |

## Not yet on Supabase

**Chemicals, deliveries, workers, activity log, training records, incidents, equipment, confined space permits, and org HazCom settings** use Postgres when `NEXT_PUBLIC_DEMO_MODE=false` (after migration `003_osha_documentation.sql`).

**New sign-ups** automatically receive prototype sample data (chemicals, deliveries, workers, etc.). Existing empty orgs can use **Settings → Load sample inventory**.

Still on the demo store: bug reports.

Apply migrations:

```bash
npm run supabase:db:push
# or locally: npm run supabase:db:reset
```
