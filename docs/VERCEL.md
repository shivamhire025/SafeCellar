# Deploy SafeCellar on Vercel

## Why you might see a 404

The Next.js app is in **`safecellar/`**, not the repository root. If Vercel’s **Root Directory** is `.` (default), it does not build the app and routes return **404**.

## Fix (required)

1. Open [Vercel Dashboard](https://vercel.com/dashboard) → your **SafeCellar** project.
2. **Settings** → **Build and Deployment**.
3. Set **Root Directory** to: `safecellar`
4. Confirm:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build` (default)
   - **Install Command:** `npm install` (default)
   - **Output Directory:** leave empty (Next.js default)
5. **Settings** → **Environment Variables** (Production + Preview):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_DEMO_MODE` | `true` |
   | `NEXT_PUBLIC_APP_NAME` | `SafeCellar` |

   Optional after first deploy (replace with your Vercel URL):

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_APP_URL` | `https://your-project.vercel.app` |

6. **Deployments** → open latest → **Redeploy** (use “Redeploy” so settings apply).

## First-time import from GitHub

1. **Add New Project** → import `shivamhire025/SafeCellar`.
2. Before deploy, click **Edit** next to **Root Directory** → enter `safecellar`.
3. Add environment variables above.
4. Deploy.

## Verify

After a successful deploy:

- `/` redirects to `/dashboard` or `/login`
- `/login` shows the SafeCellar sign-in card
- Demo login: `demo@safecellar.app` / any password

## Build logs

A correct build log includes:

```
Running "install" command: npm install
...
Running "build" command: npm run build
...
▲ Next.js 14.x
```

If you only see a static deploy or “Other” framework with no Next.js compile step, Root Directory is still wrong.

## Production Supabase (later)

Set `NEXT_PUBLIC_DEMO_MODE=false` and add Supabase env vars from `safecellar/.env.example`. Run `supabase/migrations/001_initial_schema.sql` in your Supabase project first.
