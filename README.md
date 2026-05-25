# SafeCellar

**Inspection-ready. Always.**

SafeCellar is a compliance management platform for craft breweries and wineries. Phase 1 focuses on chemical SDS and inventory management: track chemicals, enforce SDS compliance gates, manage deliveries, and export HazCom reports for inspections.

## Repository layout

| Path | Description |
|------|-------------|
| [`safecellar/`](./safecellar/) | Next.js 14 application (run all npm commands here) |
| [`safecellar/CHANGES.md`](./safecellar/CHANGES.md) | Implementation changelog |
| `PRD.md`, `DESIGN.md` | **Local only** — not in this repo (see [Private documentation](#private-documentation)) |

## Quick start

```bash
git clone https://github.com/shivamhire025/SafeCellar.git
cd SafeCellar/safecellar
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo login** (no Supabase required):

| Field | Value |
|-------|--------|
| Email | `demo@safecellar.app` |
| Password | any value |

Demo mode is enabled via `NEXT_PUBLIC_DEMO_MODE=true` in `.env.local`.

## Features (Phase 1)

- **Compliance dashboard** — score, breakdown, pending actions, activity feed
- **Chemical inventory** — list, search, filters, detail views
- **Compliance gate** — blocks compliant status until SDS is uploaded
- **SDS upload** — PDF upload flow (demo store or Supabase Storage)
- **Barcode scanning** — add chemicals and receive deliveries via camera
- **Deliveries** — timeline, create orders, receiving / scan workflow
- **SDS review queue** — consolidated outstanding SDS actions
- **Emergency Quick Response Card** — per-chemical first aid summary
- **HazCom report export** — HTML report for inspection prep
- **Collapsible sidebar** — icon-only collapsed mode with hover tooltips

## Tech stack

- [Next.js 14](https://nextjs.org/) (App Router)
- [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage) — optional; demo mode works offline
- [Tailwind CSS](https://tailwindcss.com/) v3
- [@zxing/browser](https://github.com/zxing-js/browser) — barcode scanning
- [recharts](https://recharts.org/) — dashboard charts

- **[safecellar/README.md](./safecellar/README.md)** — setup, env vars, routes, API
- **[docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md)** — system overview (no product spec)

## Scripts

Run from `safecellar/`:

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | ESLint |

## Private documentation

Product requirements (`PRD.md`) and the design system (`DESIGN.md`) are intentionally **excluded** from this public repository via `.gitignore`. Keep them in your local workspace only, or store them in a **private** repo / password-protected wiki.

Application code in `safecellar/` is safe to publish; it does not include those spec files.

## License

Proprietary — All rights reserved unless otherwise specified by the repository owner.
