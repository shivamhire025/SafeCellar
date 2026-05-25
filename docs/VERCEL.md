# Deploy SafeCellar on Vercel

## Repository layout (updated)

The Next.js app is at the **repository root** (`app/`, `package.json`, etc.), not in a subfolder. Vercel **Root Directory** should be **`.`** (default).

## Setup

1. [Vercel Dashboard](https://vercel.com/dashboard) → **Add New Project** → import `shivamhire025/SafeCellar`.
2. **Root Directory:** `.` or leave empty (do **not** use `safecellar` — that folder was removed).
3. **Framework Preset:** Next.js
4. **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_DEMO_MODE` | `true` |
   | `NEXT_PUBLIC_APP_NAME` | `SafeCellar` |

5. Deploy.

If you previously set Root Directory to `safecellar`, clear it and **Redeploy**.

## Verify deployment

| URL | Expected |
|-----|----------|
| `/api/health` | JSON `{ "ok": true }` |
| `/login` | Sign-in page |
| `/` | Redirect to `/dashboard` or `/login` |

Demo login: `demo@safecellar.app` / any password.

## Build log checklist

You should see:

```
▲ Next.js 14.x
Creating an optimized production build ...
```

If the build skips Next.js or only publishes a static file, check Root Directory and Framework settings.

## Still seeing 404?

1. **Redeploy** after changing settings (Deployments → ⋯ → Redeploy).
2. Confirm the deployment status is **Ready**, not **Error**.
3. Open the deployment URL from the Vercel dashboard (not an old project URL).
4. Try `/login` directly, not `/safecellar/login`.
5. Check **Deployment Protection** (Settings → Deployment Protection) is not blocking access.

## Supabase (production)

Set `NEXT_PUBLIC_DEMO_MODE=false` and add Supabase keys from `.env.example`. Run `supabase/migrations/001_initial_schema.sql` first.
