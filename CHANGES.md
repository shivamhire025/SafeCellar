# SafeCellar — Change Log

This file tracks implementation and UX changes made during development.

**Maintained by:** Cursor agent (see `.cursor/rules/changelog.mdc`) — append a dated section after each task that changes the app.

**References:** `PRD.md`, `DESIGN.md` (workspace root, **local only** — excluded from git via root `.gitignore`)

---

## 2026-05-25 — Sample data for new Supabase accounts

### What changed
- **Sign-up** seeds each new organization with prototype data (5 chemicals, 2 deliveries, SDS review queue, 2 workers, activity log, sample address on org).
- **Settings → Load sample inventory** for existing empty orgs (`POST /api/organization/seed-sample`).
- Deliveries, workers, activity log, and settings org info read from Supabase when not in demo mode.

### Files
- `lib/seed/organization-demo-data.ts`, `lib/deliveries/repository.ts`, `lib/workers/repository.ts`, `lib/activity/repository.ts`, `lib/organization/repository.ts`
- `lib/auth.ts`, `app/api/organization/seed-sample/route.ts`, `components/settings/load-sample-data-button.tsx`
- Delivery API routes and dashboard/settings/deliveries/workers pages

---

## 2026-05-25 — Chemicals on Supabase

### What changed
- Chemical inventory CRUD uses **Postgres** when not in demo mode (`lib/chemicals/repository.ts`): list, detail, create, bulk import, SDS verify/upload (storage bucket `sds-files`), barcode lookup.
- Creates enqueue **SDS review** rows and **activity log** entries for the signed-in org.
- Dashboard compliance score, pending chemical actions, and **SDS Review Queue** read from Supabase; deliveries/incidents still demo.

### Files
- `lib/chemicals/repository.ts`
- `app/api/chemicals/route.ts`, `app/api/chemicals/import/route.ts`, `app/api/chemicals/[id]/verify/route.ts`, `app/api/sds/upload/route.ts`, `app/api/barcode/[code]/route.ts`, `app/api/compliance/route.ts`, `app/api/reports/hazcom/route.ts`
- `app/(dashboard)/chemicals/page.tsx`, `app/(dashboard)/chemicals/[id]/page.tsx`, `app/(dashboard)/sds-review/page.tsx`, `app/(dashboard)/dashboard/page.tsx`, incident pages (chemical picker)
- `docs/SUPABASE.md`

---

## 2026-05-25 — Demo mode banner and signup errors

### What changed
- Dashboard shows an amber banner when demo mode is active (explains Marcus Chen sample user vs real Supabase signup).
- Sign-up page displays errors from `/api/auth/signup` instead of failing silently.

### Files
- `app/(dashboard)/layout.tsx`, `app/(auth)/signup/page.tsx`

---

## 2026-05-25 — Vercel + Supabase deployment guide

### What changed
- **[docs/VERCEL.md](./docs/VERCEL.md)** documents production Supabase env vars (`NEXT_PUBLIC_SUPABASE_*`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_DEMO_MODE=false`, `NEXT_PUBLIC_APP_URL`), Auth redirect URLs, and redeploy steps.
- Pushed live auth integration (sign-in, sign-up, sign-out, session) and Supabase CLI/migrations to `main` for Vercel builds.

### Files
- `docs/VERCEL.md`, plus Supabase setup files listed in the “Supabase project setup” entry below

---

## 2026-05-25 — Supabase project setup

### What changed
- Initialized **Supabase CLI** (`supabase/config.toml`, local `sds-files` bucket, npm scripts).
- Added migration `002_rls_and_storage.sql` (org RLS policies, delivery items, workers, activity log, SDS storage bucket).
- Live auth: sign-in, sign-up (org + admin profile via service role), sign-out, and `getSession()` from Supabase when `NEXT_PUBLIC_DEMO_MODE=false`.
- New docs: **[docs/SUPABASE.md](./docs/SUPABASE.md)** (hosted + local setup). README and `.env.example` updated.

### Files
- `supabase/config.toml`, `supabase/migrations/002_rls_and_storage.sql`
- `lib/supabase/env.ts`, `lib/supabase/admin.ts`, `lib/auth.ts`, `lib/demo-mode.ts`
- `app/api/auth/signup/route.ts`, `app/api/auth/signin/route.ts`, `app/api/auth/signout/route.ts`
- `app/(auth)/signup/page.tsx`, `package.json`, `.env.example`, `docs/SUPABASE.md`, `README.md`, `docs/VERCEL.md`

---

## 2026-05-25 — Annotation viewport shows full image

### What changed
- Photo annotator scales the image to fit width and height (fixes cropped tall screenshots in bug reports).
- Saved annotations export from the same canvas view so markup aligns with the preview.

### Files
- `components/incidents/incident-photo-annotator.tsx`, `lib/incident-annotation.ts`, `components/feedback/bug-report-dialog.tsx`

---

## 2026-05-25 — Bug report dialog fix

### What changed
- Fixed crash opening Report a bug: `DialogDescription` is now exported from `components/ui/dialog.tsx`.

### Files
- `components/ui/dialog.tsx`

---

## 2026-05-25 — Floating bug report button

### What changed
- **Report a bug** floating button (bottom-right) on all dashboard pages opens a dialog to describe the issue, optionally upload a screenshot, and annotate it (same tools as incident photos).
- Submissions create tickets stored in demo mode (`.data/demo-store.json`); **Bug report log** at `/bug-reports` (linked from Settings) lists open/resolved tickets with screenshots.

### Files
- `types/database.ts`, `lib/demo-store.ts`, `lib/validations/bug-report.ts`, `app/api/bug-reports/`, `components/feedback/`, `app/(dashboard)/bug-reports/page.tsx`, `app/(dashboard)/layout.tsx`, `app/(dashboard)/settings/page.tsx`

---

## 2026-05-25 — Incomplete incidents in notifications

### What changed
- Topbar **High-risk reminders** now include incidents missing photo documentation (status incomplete), linking to the incident detail page to add photos.

### Files
- `lib/demo-store.ts`, `types/database.ts`, `components/layout/notifications-menu.tsx`

---

## 2026-05-25 — Incident logging

### What changed
- **Incident Log** (`/incidents`): list near misses, injuries, illnesses, and property damage with filters by type and status.
- **Log incident** (`/incidents/new`): type, date/time, location, description, notes, chemical exposure (with chemical picker), site conditions, and multi-photo upload.
- **Photo annotation**: draw, arrows, circles, and text labels on uploaded images; annotated preview saved with the record.
- **Status**: incidents without at least one photo show **Incomplete**; adding photos marks them **Complete**.
- Sidebar and mobile nav include **Incidents**; demo store persists incidents in `.data/demo-store.json`.

### Files
- `types/database.ts`, `lib/demo-store.ts`, `lib/demo-store-persist.ts`, `lib/validations/incident.ts`, `lib/incident-status.ts`, `lib/incident-annotation.ts`
- `app/api/incidents/`, `app/(dashboard)/incidents/`, `components/incidents/`

---

## 2026-05-25 — Abbreviation hover tooltips

### What changed
- Known terms (**CIP**, **SDS**, **HazCom**, **PPE**, **OSHA**, **CAS**, **LOTO**) show a dotted underline and tooltip on hover or keyboard focus with the full name and a short description.
- Applied across page titles/descriptions, sidebar nav, forms, notifications, and dashboard copy via shared `Abbr` / `AbbreviationText` components.
- **SDS status badges** (Compliant / SDS Missing / Review Due) stay plain text with no abbreviation tooltips.

### Files
- `lib/abbreviations.ts`, `components/shared/abbreviation-tooltip.tsx`, `components/layout/page-shell.tsx`, `components/layout/topbar.tsx`, `components/layout/sidebar.tsx`, `components/chemicals/chemical-type-badge.tsx`, `components/shared/status-badge.tsx`, and related dashboard/chemical/delivery UI files.

---

## 2026-05-25 — Barcode camera scanner and image upload

### What changed
- **Camera scanner** (`BarcodeScanner`): waits for the video element before starting, uses rear-camera constraints, `autoPlay`, and absolute positioning so the preview is visible (fixes black screen).
- **Add Chemical** (`/chemicals/new` → Barcode Scan): **Upload barcode photo** decodes barcodes from an image without opening the camera; same option in the full-screen scanner.
- Delivery item scanning reuses the fixed camera component.

### Files
- `components/chemicals/barcode-scanner.tsx`, `components/chemicals/barcode-image-upload.tsx`, `lib/barcode-decode.ts`, `app/(dashboard)/chemicals/new/page.tsx`

---

## 2026-05-25 — Persist demo inventory across login sessions

### What changed
- Demo mode (bulk import, add chemical, deliveries, scans, SDS uploads) now saves to `.data/demo-store.json` on disk so data survives logout, login, and dev server restarts.
- Logout only clears the session cookie; inventory is no longer reset to seed data on re-login.

### Files
- `lib/demo-store-persist.ts`, `lib/demo-store.ts`, `.gitignore`

---

## 2026-05-25 — Toast dismiss fix

### What changed
- Action toasts (import, scan, etc.) now close when clicking **×** or when the auto-dismiss timer ends.
- Close button is always visible on toasts (not hover-only).

### Files
- `components/ui/toaster.tsx`, `components/ui/use-toast.ts`, `components/ui/toast.tsx`

---

## 2026-05-25 — Bulk import on Chemical Inventory

### What changed
- **Chemical Inventory** (`/chemicals`): **Bulk Import** opens a dialog to download a CSV template, upload or paste CSV, preview valid/invalid rows, and import in one step.
- Imported chemicals get missing SDS status and SDS review queue entries (same as single add).
- `POST /api/chemicals/import` accepts validated rows; demo store `importChemicals()` batch-creates records.

### Files
- `components/chemicals/bulk-import-dialog.tsx`, `components/chemicals/chemical-inventory-actions.tsx`, `lib/chemical-import.ts`, `lib/validations/chemical-import.ts`, `app/api/chemicals/import/route.ts`, `lib/demo-store.ts`, `app/(dashboard)/chemicals/page.tsx`

---

## 2026-05-25 — Topbar notifications for high-risk items

### What changed
- Bell icon in the top bar opens a dropdown of **high-risk reminders**: missing SDS, overdue reviews, gas hazards, SDS review queue, and pending delivery scans.
- Badge shows count (red when any critical items exist); each row links to the resolve page.
- Data from `GET /api/notifications` backed by `demoStore.getHighRiskNotifications()`.

### Files
- `components/layout/notifications-menu.tsx`, `components/layout/topbar.tsx`, `components/ui/dropdown-menu.tsx`, `app/api/notifications/route.ts`, `lib/demo-store.ts`, `types/database.ts`

---

## 2026-05-25 — Browser speech-to-text on new delivery

### What changed
- **New Delivery** (`/deliveries/new`): mic buttons on supplier, order number, notes, product name, and barcode use the Web Speech API (no cloud keys).
- Tap mic to dictate; tap again to stop. Notes append each utterance; other fields replace with the latest phrase.
- Unsupported browsers (e.g. Firefox) show a toast with guidance.

### Files
- `hooks/use-speech-recognition.ts`, `lib/speech-recognition.ts`, `types/web-speech.d.ts`, `components/shared/speech-input-button.tsx`, `app/(dashboard)/deliveries/new/page.tsx`

---

## 2026-05-25 — Recent activity log timeline

### What changed
- Dashboard **Recent Activity** uses dotted dividers and a vertical timeline rail between entries.
- Each activity with a linked record (chemical, delivery, etc.) is clickable and navigates to that detail page.

### Files
- `components/dashboard/recent-activity.tsx`, `lib/activity.ts`

---

## 2026-05-25 — Chemical detail tag layout

### What changed
- PPE and hazard classification moved to the top as floating pill tags (no cards).
- Compliant SDS badge shows a pulsing green status dot when status is `compliant`.

### Files
- `app/(dashboard)/chemicals/[id]/page.tsx`, `components/shared/status-badge.tsx`

---

## 2026-05-25 — Emergency Quick Response Card (restored)

### What changed
- Rebuilt emergency card after revert: alert-red outer card with **black** title and first-aid copy; single first-aid icon on **First Aid Protocol** only.
- Black right panel (CAS, formula, DANGER, hazard labels, pictograms); print outputs only the card.

### Files
- `components/chemicals/emergency-qr-card.tsx`, `lib/constants.ts`, `types/database.ts`, `lib/demo-store.ts`, `app/globals.css`

---

## 2026-05-25 — Brand color green to blue (fix stale CSS)

### What changed

- Cleared stale `.next` Tailwind output that was still serving old green `brand-*` utilities after the palette change.
- Replaced remaining `green-*` UI (badges, toasts, compliance score arc, status dots, empty states) with `brand-*` blue tokens.
- High compliance score color in `getComplianceColor()` now uses brand blue (`#1D4ED8`) instead of green.

### Files

- `lib/constants.ts`, `components/ui/badge.tsx`, `components/ui/toast.tsx`, `components/dashboard/pending-actions.tsx`, `app/(dashboard)/sds-review/page.tsx`, `app/(dashboard)/workers/page.tsx`, `app/(dashboard)/deliveries/[id]/delivery-detail-client.tsx`

---

## 2026-05-25 — Brand color green to blue

### What changed

- Replaced the green brand palette with blue across design tokens (`brand-50`–`brand-900`), CSS variables, sidebar/mobile nav, and HazCom report heading color.
- Sidebar and mobile nav now use `bg-brand-900`, `text-brand-200`, and `hover:bg-brand-800` instead of hardcoded green hex values.

### Files

- `tailwind.config.ts`, `app/globals.css`, `components/layout/sidebar.tsx`, `components/layout/mobile-nav.tsx`, `app/api/reports/hazcom/route.ts`

---

## 2026-05-25 — Landing page brewery hero image

### What changed

- Added `public/images/brewery-hero.jpg` as full-bleed hero background with brand gradient overlay for readable copy.

### Files

- `public/images/brewery-hero.jpg`, `components/landing/landing-page.tsx`

---

## 2026-05-25 — Landing page import fix

### What changed

- Restored `FlaskConical` import in `landing-page.tsx` (used by Chemical inventory feature card).

---

## 2026-05-25 — Login page logo and back navigation

### What changed

- Shared `Logo` component (`components/brand/logo.tsx`) used on landing and login.
- Login: larger logo above the card (links to `/`), **Back** button top-left to landing page.

### Files

- `components/brand/logo.tsx`, `app/(auth)/login/page.tsx`, `components/landing/landing-page.tsx`

---

## 2026-05-25 — Marketing landing page

### What changed

- Replaced root redirect with a single-page marketing landing at `/`.
- Nav **Try Now**, hero CTA, and bottom CTA all link to `/login`.
- Features section highlights Phase 1 P0 capabilities (inventory, SDS, scanning, deliveries, compliance, HazCom export).

### Files

- `app/page.tsx`, `components/landing/landing-page.tsx`

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
- Design tokens in `tailwind.config.ts` and `app/globals.css` (page bg `#F3F4F6`; brand palette updated to blue on 2026-05-25).
- Demo mode: `NEXT_PUBLIC_DEMO_MODE=true` with in-memory `lib/demo-store.ts` (no Supabase required for local prototype).

### Phase 1 P0 features

| Feature                      | Routes / notes                                                  |
| ---------------------------- | --------------------------------------------------------------- |
| Auth + signup                | `/login`, `/signup` (2-step org setup UI)                       |
| Compliance dashboard         | `/dashboard` — score card, breakdown, pending actions, activity |
| Chemical inventory           | `/chemicals`, `/chemicals/new`, `/chemicals/[id]`               |
| Compliance gate + SDS upload | Red banner when `sds_status !== 'compliant'`; `/api/sds/upload` |
| Barcode scanning             | `@zxing/browser` on add chemical + delivery receiving           |
| Deliveries                   | `/deliveries`, `/deliveries/new`, `/deliveries/[id]` + scan API |
| SDS review queue             | `/sds-review`                                                   |
| Emergency QR card            | Dark card on chemical detail + print                            |
| HazCom export                | `/api/reports/hazcom` (HTML report download)                    |
| Workers (P1 stub)            | `/workers` — roster table, training column placeholder          |
| Settings                     | `/settings` — org info display                                  |

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

| Area                                                 | Change                                    |
| ---------------------------------------------------- | ----------------------------------------- |
| Page title (`app/layout.tsx`)                        | `SafeCellar \| Inspection-ready. Always.` |
| Compliance gate                                      | `SDS Required:` (colon)                   |
| Chemicals, workers, SDS review descriptions          | Periods instead of em dash clauses        |
| Delivery headers                                     | `·` between order # and supplier          |
| Empty table cells / HazCom report                    | `N/A` instead of `—`                      |
| Demo store (first aid, SDS version, pending actions) | Punctuation updates                       |
| `README.md`                                          | Same style                                |

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
