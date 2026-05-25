# SafeCellar — Change Log

This file tracks implementation and UX changes made during development.

**Maintained by:** Cursor agent (see `.cursor/rules/changelog.mdc`) — append a dated section after each task that changes the app.

**References:** `PRD.md`, `DESIGN.md` (workspace root, **local only** — excluded from git via root `.gitignore`)

---

## 2026-05-25 — Fix Vercel 404: move app to repository root

### What changed
- Moved Next.js app from `safecellar/` to **repository root** so Vercel builds with default Root Directory (`.`).
- Added `/api/health` for deployment smoke tests.
- Split `lib/demo-mode.ts` from `demo-store` for lighter Edge middleware.
- `export const dynamic = "force-dynamic"` on dashboard layout.
- Updated README and `docs/VERCEL.md` (Root Directory must **not** be `safecellar` anymore).

### Files
- All app paths now at repo root; `safecellar/` removed from git.

---

## 2026-05-25 — Vercel 404 fix (root directory)

### What changed
- Added `safecellar/vercel.json` with Next.js framework preset and demo env vars.
- Added `docs/VERCEL.md` with Root Directory = `safecellar` instructions (fixes Vercel 404 when building repo root).

### Files
- `safecellar/vercel.json`, `docs/VERCEL.md`, `README.md`

---

## 2026-05-25 — GitHub documentation and push (empty remote)

### What changed
- Root `README.md` expanded: features, quick start, scripts, private-docs policy.
- `safecellar/README.md` rewritten: env table, structure, routes, API, Supabase steps.
- Added `docs/ARCHITECTURE.md` (public-safe architecture overview).
- Pushed to empty [github.com/shivamhire025/SafeCellar](https://github.com/shivamhire025/SafeCellar) without `PRD.md` / `DESIGN.md`.

### Files
- `README.md`, `safecellar/README.md`, `docs/ARCHITECTURE.md`

---

## 2026-05-25 — Exclude PRD/DESIGN from public GitHub

### What changed
- Root `.gitignore` added: `PRD.md`, `DESIGN.md` not tracked for public remotes.
- Removed `PRD.md` and `DESIGN.md` from git index (`git rm --cached`); files remain on disk locally.
- Root and `safecellar/README.md` updated to describe local-only docs.

### Rationale
Product requirements and design spec should not ship to a public repository. Application code in `safecellar/` is still publishable; use a **private** GitHub repo if the whole monorepo must be remote-backed.

---

## 2026-05-25 — GitHub remote linked

### What changed
- Local repo connected to [github.com/shivamhire025/SafeCellar](https://github.com/shivamhire025/SafeCellar).
- Merged GitHub's initial `README.md` commit with local history (`--allow-unrelated-histories`).
- Pushed full prototype to `origin/main`; local `main` tracks `origin/main`.

### Files
- Git only (no app code changes). Root `README.md` from GitHub preserved alongside `safecellar/README.md`.

---

## 2026-05-24 — Initial MVP scaffold (Phase 1 P0)

### Project setup
- Created `safecellar/` Next.js 14 App Router app (manual scaffold; `create-next-app` did not complete interactively).
- Tech stack per PRD §5: Tailwind CSS v3, shadcn-style UI primitives, Supabase client stubs, `@zxing/browser`, `recharts`, `react-pdf` (deps installed; PDF viewer not fully wired).
- Folder structure per PRD §6: `app/(auth)`, `app/(dashboard)`, `components/`, `lib/`, `hooks/`, `types/`, `supabase/migrations/`.
- Design tokens in `tailwind.config.ts` and `app/globals.css` (brand green `#1A6B3A`, sidebar `#0D3D21`, page bg `#F3F4F6`).
- Demo mode: `NEXT_PUBLIC_DEMO_MODE=true` with in-memory `lib/demo-store.ts` (no Supabase required for local prototype).

### Phase 1 P0 features
| Feature | Routes / notes |
|--------|----------------|
| Auth + signup | `/login`, `/signup` (2-step org setup UI) |
| Compliance dashboard | `/dashboard` — score card, breakdown, pending actions, activity |
| Chemical inventory | `/chemicals`, `/chemicals/new`, `/chemicals/[id]` |
| Compliance gate + SDS upload | Red banner when `sds_status !== 'compliant'`; `/api/sds/upload` |
| Barcode scanning | `@zxing/browser` on add chemical + delivery receiving |
| Deliveries | `/deliveries`, `/deliveries/new`, `/deliveries/[id]` + scan API |
| SDS review queue | `/sds-review` |
| Emergency QR card | Dark card on chemical detail + print |
| HazCom export | `/api/reports/hazcom` (HTML report download) |
| Workers (P1 stub) | `/workers` — roster table, training column placeholder |
| Settings | `/settings` — org info display |

### API routes (demo-backed)
- `POST /api/auth/signin`, `POST /api/auth/signout`
- `GET|POST /api/chemicals`, `POST /api/chemicals/[id]/verify`
- `GET|POST /api/deliveries`, `GET|PATCH /api/deliveries/[id]`, `POST /api/deliveries/[id]/scan`
- `GET /api/barcode/[code]`, `POST /api/sds/upload`
- `GET /api/compliance`, `GET /api/reports/hazcom`

### Database
- `supabase/migrations/001_initial_schema.sql` — full schema + RLS helpers (for live Supabase; not required in demo mode).

### Demo data
- Organization: Cascade Creek Brewery (Portland, OR).
- Sample chemicals, deliveries, SDS review queue items, workers, activity log.

---

## 2026-05-25 — Copy: remove em dashes

Replaced em dashes (`—`) in user-facing copy with periods, colons, middots (`·`), pipes (`|`), or `N/A`.

| Area | Change |
|------|--------|
| Page title (`app/layout.tsx`) | `SafeCellar \| Inspection-ready. Always.` |
| Compliance gate | `SDS Required:` (colon) |
| Chemicals, workers, SDS review descriptions | Periods instead of em dash clauses |
| Delivery headers | `·` between order # and supplier |
| Empty table cells / HazCom report | `N/A` instead of `—` |
| Demo store (first aid, SDS version, pending actions) | Punctuation updates |
| `README.md` | Same style |

**Files touched:** `app/`, `components/`, `lib/demo-store.ts`, `app/api/reports/hazcom/route.ts`, `README.md`

---

## 2026-05-25 — Collapsible sidebar

### Behavior
- **Expanded (220px):** Icon + label for each nav item; SafeCellar wordmark; Settings + Sign out labels; user name by avatar; collapse control (chevron left) in header.
- **Collapsed (64px):** Icons only; `SC` logo mark; expand control (chevron right) below header; **hover tooltips** show labels (nav, Settings, Sign out, expand, user name).
- Preference persisted in `localStorage` key `safecellar-sidebar-collapsed`.
- Width transition `duration-200`; matches DESIGN.md sidebar spec.
- Mobile (`< md`): unchanged bottom nav (`components/layout/mobile-nav.tsx`).

### Files
- `components/layout/sidebar.tsx` — full rewrite with `SidebarTooltip`, `NavLink`, collapse state.

---

## 2026-05-25 — Changelog maintenance policy

### What changed
- Agent rule added: `.cursor/rules/changelog.mdc` (`alwaysApply: true`) so future sessions update this file after app changes.
- This file documents the update template and when to skip (typos-only, no code, etc.).

---

## How to update this file

Add a **new dated section at the top** of the changelog entries (below References). See `.cursor/rules/changelog.mdc` for the full policy.

```markdown
## YYYY-MM-DD — Short title

### What changed
- Bullet list of behavior or files

### Files (optional)
- path/to/file.tsx
```

---

## Not yet implemented (from PRD)

- Live Supabase auth, storage, and RLS-backed CRUD (demo mode only today).
- Inline SDS PDF viewer (`react-pdf` modal).
- Worker invite flow, email notifications (P1).
- Full onboarding checklist on first dashboard visit.
- Sidebar expand-on-hover only (current: explicit toggle + persisted state).
