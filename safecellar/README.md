# SafeCellar Application

Next.js 14 app for chemical compliance at craft beverage facilities.

## Prerequisites

- Node.js 18+
- npm 9+

## Environment variables

Copy the example file and adjust as needed:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_DEMO_MODE` | No | `true` (default) uses in-memory demo data |
| `NEXT_PUBLIC_SUPABASE_URL` | For production | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | For production | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server only | Never expose to the browser |
| `NEXT_PUBLIC_APP_URL` | No | e.g. `http://localhost:3000` |
| `NEXT_PUBLIC_APP_NAME` | No | Display name (`SafeCellar`) |

With demo mode, you can run the app without Supabase.

## Development

```bash
npm install
npm run dev
```

Sign in at `/login` with `demo@safecellar.app` and any password.

## Production build

```bash
npm run build
npm start
```

## Project structure

```
safecellar/
├── app/
│   ├── (auth)/          # Login, signup (no sidebar)
│   ├── (dashboard)/     # Main app (sidebar layout)
│   │   ├── dashboard/
│   │   ├── chemicals/   # Inventory, new, [id]
│   │   ├── deliveries/
│   │   ├── sds-review/
│   │   ├── workers/
│   │   └── settings/
│   └── api/             # REST routes (demo or Supabase-backed)
├── components/
│   ├── ui/              # Buttons, cards, forms, etc.
│   ├── layout/          # Sidebar, topbar, page shell
│   ├── dashboard/
│   ├── chemicals/
│   └── shared/          # Compliance gate, badges, empty states
├── lib/
│   ├── demo-store.ts    # In-memory data when demo mode is on
│   ├── supabase/        # Clients + middleware
│   └── validations/     # Zod schemas
├── supabase/migrations/ # PostgreSQL schema (for live Supabase)
├── types/
└── hooks/
```

## Routes

| Route | Description |
|-------|-------------|
| `/login`, `/signup` | Authentication |
| `/dashboard` | Compliance overview |
| `/chemicals` | Chemical inventory |
| `/chemicals/new` | Add chemical (manual or barcode) |
| `/chemicals/[id]` | Detail, SDS upload, emergency card |
| `/deliveries` | Delivery timeline |
| `/deliveries/new` | Create delivery |
| `/deliveries/[id]` | Receiving and item scan |
| `/sds-review` | SDS review queue |
| `/workers` | Worker roster (Phase 2 training stub) |
| `/settings` | Organization settings |

## API routes

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/auth/signin` | Demo session |
| POST | `/api/auth/signout` | Clear session |
| GET/POST | `/api/chemicals` | List / create chemicals |
| POST | `/api/chemicals/[id]/verify` | Mark SDS verified |
| GET/POST | `/api/deliveries` | List / create deliveries |
| GET/PATCH | `/api/deliveries/[id]` | Delivery detail / update status |
| POST | `/api/deliveries/[id]/scan` | Scan delivery item |
| GET | `/api/barcode/[code]` | Barcode lookup |
| POST | `/api/sds/upload` | Upload SDS metadata |
| GET | `/api/compliance` | Compliance stats |
| GET | `/api/reports/hazcom` | HazCom HTML export |

In demo mode, these routes use `lib/demo-store.ts`.

## Supabase setup (production)

1. Create a [Supabase](https://supabase.com/) project.
2. Run SQL from `supabase/migrations/001_initial_schema.sql` in the SQL editor.
3. Set env vars in `.env.local` and set `NEXT_PUBLIC_DEMO_MODE=false`.
4. Configure Auth (email/password) and a Storage bucket for SDS PDFs.
5. Wire server routes to Supabase clients in `lib/supabase/` (demo handlers can be replaced incrementally).

## Design system

UI uses a dark green brand palette (`#1A6B3A` primary, `#0D3D21` sidebar) on a light gray page background. Tokens live in:

- `tailwind.config.ts` (`brand` scale)
- `app/globals.css` (CSS variables)

The full design spec file is kept **local only** (not in git).

## Demo data

Demo organization: **Cascade Creek Brewery** (Portland, OR). Sample chemicals, deliveries, and SDS review items are seeded in `lib/demo-store.ts`.

## Changelog

See [CHANGES.md](./CHANGES.md) for implementation history.

## Phase 1 status

| Feature | Status |
|---------|--------|
| Auth + signup UI | Done (demo) |
| Compliance dashboard | Done |
| Chemical inventory + compliance gate | Done |
| SDS upload | Done (demo) |
| Barcode scanning | Done |
| Deliveries + receiving | Done |
| SDS review queue | Done |
| Emergency QR card | Done |
| HazCom export | Done (HTML) |
| Live Supabase CRUD | Planned |
| Inline SDS PDF viewer | Planned |
