# SafeCellar

**Inspection-ready. Always.**

Compliance management platform for craft breweries and wineries. Phase 1 focuses on chemical SDS and inventory management.

## Quick start

```bash
git clone https://github.com/shivamhire025/SafeCellar.git
cd SafeCellar
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Demo login: `demo@safecellar.app` (any password).

## Deploy on Vercel

1. Import [github.com/shivamhire025/SafeCellar](https://github.com/shivamhire025/SafeCellar) on Vercel.
2. **Root Directory:** leave as `.` (repository root — the Next.js app lives here).
3. **Framework:** Next.js (auto-detected).
4. **Environment variables:**
   - `NEXT_PUBLIC_DEMO_MODE` = `true`
5. Deploy, then open `/login` on your `*.vercel.app` URL.

Troubleshooting: **[docs/VERCEL.md](./docs/VERCEL.md)**

## Features (Phase 1)

- Compliance dashboard, chemical inventory, compliance gate, SDS upload
- Barcode scanning, deliveries, SDS review queue
- Emergency Quick Response Card, HazCom export
- Collapsible sidebar with tooltips

## Supabase (optional)

The app runs in **demo mode** by default. To use Postgres, Auth, and SDS storage:

1. Follow **[docs/SUPABASE.md](./docs/SUPABASE.md)**
2. Set `NEXT_PUBLIC_DEMO_MODE=false` and your Supabase keys in `.env.local`

## Documentation

| Doc | Description |
|-----|-------------|
| [CHANGES.md](./CHANGES.md) | Implementation changelog |
| [docs/SUPABASE.md](./docs/SUPABASE.md) | Supabase project setup |
| [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) | Public architecture overview |
| [docs/VERCEL.md](./docs/VERCEL.md) | Vercel deployment guide |

`PRD.md` and `DESIGN.md` are **local only** (not in git). See `.gitignore`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |

## License

Proprietary — All rights reserved unless otherwise specified by the repository owner.
