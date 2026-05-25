# SafeCellar — Architecture (public overview)

High-level architecture for the open-source application code. Detailed product requirements are maintained outside this repository.

## System context

```
┌─────────────┐     HTTPS      ┌──────────────────┐
│   Browser   │ ◄────────────► │  Next.js 14 App  │
│  (admin /   │                │  (App Router)    │
│   worker)   │                └────────┬─────────┘
└─────────────┘                         │
                          demo mode     │  production
                          ┌─────────────┴─────────────┐
                          ▼                           ▼
                   ┌─────────────┐           ┌──────────────┐
                   │ demo-store  │           │   Supabase   │
                   │ (in-memory) │           │ PG + Auth +  │
                   └─────────────┘           │   Storage    │
                                             └──────────────┘
```

## Multi-tenancy

Production schema uses `organization_id` on all tenant tables with Row Level Security (RLS). Users belong to an organization via `profiles`.

## Core domain concepts

| Concept | Description |
|---------|-------------|
| **Compliance gate** | A chemical cannot be `compliant` until an SDS is uploaded and verified |
| **Chemical** | Inventory record with type, location, SDS status, PPE, hazard classes |
| **Delivery** | Purchase/receipt workflow with per-item barcode scanning |
| **SDS review queue** | Action list for new chemicals, annual reviews, supplier changes |

## Auth flow

1. Middleware (`middleware.ts`) protects dashboard routes.
2. Demo mode: cookie-based session via `lib/auth.ts`.
3. Production: Supabase Auth JWT + `@supabase/ssr` cookie handling.

## Frontend layers

- **Server Components** — initial data load where applicable
- **Client Components** — forms, scanner, sidebar collapse, toasts
- **API routes** — mutations and exports

## Security notes

- Do not commit `.env.local` or service role keys.
- Do not commit `PRD.md` / `DESIGN.md` to public remotes.
- Enforce RLS on all Supabase tables before production launch.
