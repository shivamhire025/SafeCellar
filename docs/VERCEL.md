# Deploy SafeCellar on Vercel

## Repository layout

The Next.js app is at the **repository root** (`app/`, `package.json`, etc.). Vercel **Root Directory** should be **`.`** (default).

## Setup

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project** → import `shivamhire025/SafeCellar`.
2. **Root Directory:** `.` or leave empty (do **not** use `safecellar`).
3. **Framework Preset:** Next.js
4. Deploy once, then configure environment variables (below).
5. **Redeploy** after changing env vars (Deployments → ⋯ → Redeploy).

If you previously set Root Directory to `safecellar`, clear it and redeploy.

---

## Production with Supabase (recommended)

### 1. Supabase project

Follow **[SUPABASE.md](./SUPABASE.md)** to create a hosted project and apply migrations (`001` + `002`).

### 2. Vercel environment variables

**Settings → Environment Variables** — add for **Production** (and **Preview** if previews should use Supabase too):

| Name | Value | Notes |
|------|--------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` | Supabase → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` | API → `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` | API → `service_role` — **server only**, no `NEXT_PUBLIC_` prefix |
| `NEXT_PUBLIC_DEMO_MODE` | `false` | Required to enable Supabase Auth |
| `NEXT_PUBLIC_APP_URL` | `https://your-app.vercel.app` | Your production URL (auth redirects) |
| `NEXT_PUBLIC_APP_NAME` | `SafeCellar` | Optional |

Copy keys from the Supabase dashboard; do not commit them to git.

### 3. Supabase Auth URLs

Supabase Dashboard → **Authentication** → **URL configuration**:

| Field | Example |
|-------|---------|
| **Site URL** | `https://your-app.vercel.app` |
| **Redirect URLs** | `https://your-app.vercel.app/**` |

Add preview URLs if needed, e.g. `https://*-your-team.vercel.app/**`.

### 4. Redeploy

Trigger a new production deployment so the build picks up env vars.

### 5. Verify

| URL | Expected |
|-----|----------|
| `/api/health` | `{ "ok": true }` |
| `/signup` | Creates user + org in Supabase (`auth.users`, `organizations`, `profiles`) |
| `/login` | Supabase session cookie (not demo cookie) |

Check **Table Editor** in Supabase after signup.

---

## Demo mode on Vercel (optional)

For a database-free prototype deployment, use only:

| Name | Value |
|------|--------|
| `NEXT_PUBLIC_DEMO_MODE` | `true` |
| `NEXT_PUBLIC_APP_NAME` | `SafeCellar` |

Demo login: `demo@safecellar.app` / any password. No Supabase keys required.

---

## Build log checklist

You should see:

```
▲ Next.js 14.x
Creating an optimized production build ...
```

If the build skips Next.js or only publishes a static file, check Root Directory and Framework settings.

## Still seeing 404?

1. **Redeploy** after changing settings.
2. Confirm deployment status is **Ready**, not **Error**.
3. Open the URL from the Vercel dashboard (not an old project URL).
4. Try `/login` directly.
5. Check **Deployment Protection** is not blocking access.

## Data layer note

With `NEXT_PUBLIC_DEMO_MODE=false`, **auth** uses Supabase. Chemicals, deliveries, incidents, and related API routes still read/write the **in-memory demo store** until migrated per resource. See [SUPABASE.md](./SUPABASE.md) — “Not yet on Supabase”.
