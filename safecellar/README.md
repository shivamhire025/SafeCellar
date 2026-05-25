# SafeCellar

**Inspection-ready. Always.**

Compliance management platform for craft breweries and wineries. Phase 1 MVP (Chemical SDS & Inventory Management).

## Tech Stack

- Next.js 14 (App Router)
- Supabase (PostgreSQL, Auth, Storage)
- Tailwind CSS v3 + shadcn/ui patterns
- @zxing/browser (barcode scanning)
- recharts (dashboard charts)

## Quick Start

```bash
cd safecellar
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Login

- **Email:** `demo@safecellar.app`
- **Password:** any value

Demo mode (`NEXT_PUBLIC_DEMO_MODE=true`) runs with in-memory data. No Supabase required.

## Project Structure

See the App Router layout under `app/` (`(auth)`, `(dashboard)`, `api/`). Full product spec and folder map live in local-only `PRD.md` at the workspace root (not committed to public GitHub).

## Change log

Implementation history is recorded in [`CHANGES.md`](./CHANGES.md). Agents update it automatically after each meaningful change.

## Connecting Supabase

1. Create a Supabase project
2. Run `supabase/migrations/001_initial_schema.sql`
3. Copy `.env.example` → `.env.local` and set:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Set `NEXT_PUBLIC_DEMO_MODE=false`

## Phase 1 P0 Features

- [x] Authentication + org signup flow
- [x] Compliance dashboard
- [x] Chemical inventory (list, add, detail)
- [x] Compliance gate + SDS upload
- [x] Barcode scanning
- [x] Delivery timeline + receiving flow
- [x] SDS review queue
- [x] Emergency Quick Response Card
- [x] HazCom report export

## Design

All UI follows `DESIGN.md`: dark green brand (`#1A6B3A`), light gray page background, icon sidebar.
