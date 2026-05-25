# SafeCellar — Product Requirements Document

> **Version:** 1.0  
> **Date:** 2026-05-24  
> **Status:** Ready for development  
> **Audience:** Cursor, coding agents, and developers building the MVP  

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Problem Statement](#2-problem-statement)
3. [Target Users and Personas](#3-target-users-and-personas)
4. [Narrative Use Cases](#4-narrative-use-cases)
5. [Tech Stack](#5-tech-stack)
6. [Project Folder Structure](#6-project-folder-structure)
7. [Environment Variables](#7-environment-variables)
8. [Database Schema (Supabase PostgreSQL)](#8-database-schema)
9. [Authentication and Roles](#9-authentication-and-roles)
10. [Screen Inventory and Routes](#10-screen-inventory-and-routes)
11. [Phase 1 — Core Feature Specs](#11-phase-1-core-feature-specs)
12. [Phase 2 — Equipment and Task Management (Future)](#12-phase-2-future)
13. [Product Roadmap](#13-product-roadmap)
14. [Key User Flows](#14-key-user-flows)
15. [API Routes](#15-api-routes)
16. [Component Library Conventions](#16-component-library-conventions)

---

## 1. Product Overview

**SafeCellar** is a compliance management platform purpose-built for craft breweries and wineries. It replaces the filing cabinet of SDS binders, the spreadsheet of delivery logs, and the paper sign-in sheets that currently constitute the compliance stack at most small craft beverage facilities.

The MVP (Phase 1) focuses on **Chemical SDS and Inventory Management** — the single highest-impact, lowest-effort pain point in the craft beverage compliance space (CB-01, Impact 90%, Effort 1 in the research dataset). This is the product that makes a 12-person craft winery inspection-ready for an OSHA visit within 30 days of signup.

**Working product name:** SafeCellar  
**Tagline:** Inspection-ready. Always.  
**Primary market:** Craft breweries and wineries, 5–100 employees, United States  
**Buying trigger:** Prior OSHA citation, near-miss, insurance premium increase, or "we know we're not compliant"

---

## 2. Problem Statement

### The Research-Backed Reality

A craft brewery or winery with 12 employees faces the same regulatory obligations as a 500-person manufacturer. OSHA, EPA, TTB, and FDA all apply. But they have no EHS manager, no compliance software, and no budget for enterprise platforms like Intelex or Cority ($50K+ per year).

Their current state is:
- A binder somewhere in the office with SDS sheets, some printed 3 years ago
- No tracking of which chemicals have current vs. outdated SDS documents  
- Chemicals arrive via multiple channels (regular suppliers, one-off orders, samples) — no centralized intake
- When OSHA calls, the owner spends the evening frantically printing SDS sheets off the internet and hoping they match the exact product version
- No written Hazard Communication plan (OSHA requires one for any facility using hazardous chemicals)
- No PPE training records tied to specific chemicals

### Specific Research Findings Incorporated

1. **Decentralized tracking problem**: Chemicals enter facilities through multiple pathways (regular deliveries, samples, emergency purchases). Each entry point needs to be a potential SDS intake trigger.

2. **Outdated SDS problem**: The most common violation is not "no SDS" — it's "SDS on file but outdated." OSHA requires the SDS to match the specific product version in use. A supplier formula change means the old SDS is non-compliant.

3. **CIP chemical hazard**: Clean-In-Place chemicals (caustic cleaners like sodium hydroxide, sanitizers like peracetic acid) are among the most hazardous chemicals in a craft beverage facility. They require their own SDS classification and PPE protocol distinct from normal cleaning chemicals.

4. **Gas hazard compounds**: CO2 from fermentation and SO2 from winery sulfiting are both IDLH (Immediately Dangerous to Life and Health) compounds. These chemicals need a distinct classification and safety protocol in the system.

5. **Confined space linkage**: The same tanks where these gas hazards accumulate are confined spaces under OSHA 29 CFR 1910.146. Phase 2 will leverage the chemical inventory data to auto-populate confined space permit hazard sections.

### The Compliance Gate Concept

The central mechanic of SafeCellar is the **compliance gate**: a chemical in the system cannot be marked "compliant" until its SDS is uploaded and verified. This gate does not clear automatically. It is a hard blocker visible on the dashboard and on the chemical detail screen. This is not a reminder — it is a status condition.

---

## 3. Target Users and Personas

### Persona 1 — Marcus, Craft Brewery Owner-Operator

- **Role:** Owner, head brewer, de facto safety manager
- **Size:** 18-person production brewery with taproom
- **Current state:** No dedicated compliance staff. Has a binder with some SDS sheets. Got an OSHA citation for missing SDS on a caustic CIP cleaner two years ago. Fine was $4,200.
- **Primary fear:** Another OSHA inspection. Knows he's non-compliant.
- **What he needs:** A tool that tells him exactly what's missing and won't let him ignore it.
- **Device:** Desktop in the office + iPhone on the production floor
- **Technical level:** Comfortable with modern SaaS. Uses Ekos for production management.
- **Willingness to pay:** $150–250/month if it genuinely reduces inspection risk

### Persona 2 — Elena, Craft Winery Operations Manager

- **Role:** Operations manager at a 35-person estate winery
- **Size:** 60 acres, crush facility, tasting room, DTC shipping
- **Current state:** Uses a Google Sheet to track chemical deliveries. SDS binder exists but hasn't been audited in 18 months. Had a near-miss last harvest when a cellar worker entered a tank without testing the atmosphere.
- **Primary fear:** Worker injury. Also worried about the January 2025 allergen labeling rule she only half-understood.
- **What she needs:** A system that logs every chemical that arrives and makes her management team accountable for completing SDS documentation.
- **Device:** Desktop at her desk + Android phone during cellar rounds
- **Technical level:** Power spreadsheet user. Comfortable with cloud tools.
- **Willingness to pay:** $200–350/month

### Persona 3 — Jorge, Cellar Worker

- **Role:** Full-time cellar worker at a 25-person winery
- **Device:** Personal Android phone
- **Interactions with SafeCellar:** Receives task assignments, views chemical SDS during work, scans barcodes on new deliveries
- **What he needs:** A simple interface that tells him what to do and how to do it safely. Does not need to manage or configure anything.
- **Language:** Bilingual (English/Spanish). System should support Spanish for worker-facing screens in Phase 2.

---

## 4. Narrative Use Cases

### UC-01: The OSHA Inspection Phone Call (Core Use Case)

It's a Tuesday afternoon at 3pm. Marcus, the brewery owner, gets a call — OSHA is showing up tomorrow morning. Anonymous complaint about chemical handling.

**Before SafeCellar:** Marcus sprints to his office, digs through the binder, and realizes the SDS for his caustic CIP cleaner is missing. He gets the version he bought 8 months ago from a new supplier. He spends four hours printing SDS sheets from various manufacturer websites, unsure if they match the exact product formulations he has in the building. He can't generate a Hazard Communication plan. He has no PPE training records. Morning arrives with partial documentation and high anxiety.

**With SafeCellar:** Marcus opens SafeCellar on his phone. The Dashboard shows a Compliance Status tile — green, 94%. He taps into Chemicals. All 23 chemicals in his cellar are listed with their compliance status. He taps "Export HazCom Report" — the system generates a PDF Hazard Communication plan showing all chemicals, their SDS status, storage locations, and PPE requirements. He prints it. Inspection takes 25 minutes. No citations.

**The difference:** SafeCellar makes the compliance picture visible and generates the documentation automatically. The owner doesn't need to understand OSHA regulations — he just needs to keep the dashboard green.

---

### UC-02: New Chemical Arrives on a Delivery

Elena's winery receives a delivery from their chemical supplier. Among the items is a new sanitizer they haven't used before — a peracetic acid-based product the supplier recommended as a switch from their old iodophor.

**Before SafeCellar:** The delivery gets received by whoever is working that morning. The box goes in the chemical storage room. Nobody notes it's a new product. No SDS is requested from the supplier. Six months later, an OSHA inspector finds the product with no SDS on file.

**With SafeCellar:** The delivery was created in the system last week when Elena placed the order. When the shipment arrives, the receiving crew opens SafeCellar on the break room tablet and scans the barcode on each item. The peracetic acid is new to the system. Immediately, a red **New Chemical — SDS Required** flag appears. The delivery is marked "Received — Pending SDS Review." Elena gets a notification. She uploads the SDS from the supplier's website. The compliance gate clears. The chemical is now in the inventory with its correct classification (CIP Chemical), storage location (chemical cage, cellar B), and PPE requirements (nitrile gloves, face shield, apron).

---

### UC-03: Outdated SDS Discovered During Annual Review

Marcus's brewery has been on SafeCellar for 11 months. The system flags that 3 SDS documents are approaching their 12-month review date. One of them — the sodium hydroxide caustic cleaner — shows a "Last Verified" date of 14 months ago.

**Before SafeCellar:** This would never have been discovered until an inspector pointed it out.

**With SafeCellar:** Marcus opens the SDS Review Queue. The system lists the 3 chemicals due for review with direct links to the manufacturer websites he bookmarked when uploading them originally. He pulls the current SDS from the supplier portal, compares the revision date to the one on file — it changed 6 months ago when the supplier updated their formula. He uploads the new version. The SDS Date and Last Verified fields update. Compliance status stays green.

---

### UC-04: CIP Chemical Safety Emergency

A new cellar worker at Elena's winery accidentally splashes caustic CIP cleaner on his forearm during tank cleaning. He doesn't know the first aid protocol for a sodium hydroxide exposure.

**Before SafeCellar:** He looks for the SDS binder. It's not in the cellar — it's in the office. He's alone. He runs cold water on it and waits.

**With SafeCellar:** Every chemical in the system has an **Emergency Quick Response Card** — a one-screen summary generated from the SDS: what the chemical is, what PPE is required, and a 3-step first aid protocol. He pulls up the chemical from the shared cellar tablet. The card shows: "NaOH — Caustic. Skin contact: Flush with water 20 minutes. Remove contaminated clothing. Seek immediate medical attention if pain persists." He follows the protocol. The incident is logged.

---

## 5. Tech Stack

### Recommended Stack (Minimum Complexity, Maximum Output Speed)

| Layer | Technology | Reason |
|-------|-----------|--------|
| Framework | Next.js 14 (App Router) | Single codebase for server + client. Built-in API routes. Vercel-native. |
| Database | Supabase (PostgreSQL) | Auth + DB + Storage + Realtime in one platform. No backend server needed. |
| Auth | Supabase Auth | JWT-based, built-in email/password + magic link. Row Level Security for multi-tenancy. |
| File Storage | Supabase Storage | SDS PDF uploads. Per-organization bucket isolation. |
| Styling | Tailwind CSS v3 | Utility-first, fast iteration, works with shadcn/ui. |
| UI Components | shadcn/ui | Pre-built accessible components using Radix UI primitives. Copy-paste into project. |
| Barcode Scanning | @zxing/browser | Client-side barcode/QR scanning via webcam or mobile camera. No native app required. |
| PDF Viewing | react-pdf | Render SDS PDFs inline in the browser without leaving the app. |
| Charts | recharts | React-native chart library for compliance dashboard visuals. |
| Icons | lucide-react | Clean, consistent icon set used by shadcn/ui. |
| Hosting | Vercel | Zero-config Next.js deployment. Free tier sufficient for MVP. |

### Package List

```json
{
  "dependencies": {
    "next": "14.x",
    "@supabase/supabase-js": "^2.x",
    "@supabase/ssr": "^0.x",
    "tailwindcss": "^3.x",
    "@radix-ui/react-dialog": "latest",
    "@radix-ui/react-dropdown-menu": "latest",
    "@radix-ui/react-select": "latest",
    "@radix-ui/react-toast": "latest",
    "shadcn-ui": "latest",
    "lucide-react": "latest",
    "recharts": "^2.x",
    "@zxing/browser": "^0.x",
    "@zxing/library": "^0.x",
    "react-pdf": "^7.x",
    "clsx": "latest",
    "tailwind-merge": "latest",
    "class-variance-authority": "latest",
    "date-fns": "^3.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "latest"
  }
}
```

---

## 6. Project Folder Structure

```
safecellar/
├── app/                              # Next.js App Router
│   ├── (auth)/                       # Auth route group (no sidebar layout)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── signup/
│   │       └── page.tsx
│   ├── (dashboard)/                  # Main app route group (sidebar layout)
│   │   ├── layout.tsx                # Sidebar + topbar layout wrapper
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Compliance overview dashboard
│   │   ├── chemicals/
│   │   │   ├── page.tsx              # Chemical inventory list
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Add chemical (manual + barcode)
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Chemical detail + SDS management
│   │   ├── deliveries/
│   │   │   ├── page.tsx              # Delivery timeline
│   │   │   ├── new/
│   │   │   │   └── page.tsx          # Create delivery
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Delivery detail + item scanning
│   │   ├── sds-review/
│   │   │   └── page.tsx              # SDS review queue
│   │   ├── workers/
│   │   │   ├── page.tsx              # Worker roster
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Worker detail + training history
│   │   └── settings/
│   │       └── page.tsx              # Org settings, facility info
│   ├── api/                          # Next.js API routes
│   │   ├── chemicals/
│   │   │   └── route.ts
│   │   ├── deliveries/
│   │   │   └── route.ts
│   │   ├── sds/
│   │   │   └── upload/
│   │   │       └── route.ts
│   │   └── barcode/
│   │       └── route.ts
│   ├── layout.tsx                    # Root layout
│   └── globals.css                   # Tailwind base + custom CSS vars
│
├── components/
│   ├── ui/                           # shadcn/ui components (auto-generated)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── table.tsx
│   │   ├── toast.tsx
│   │   └── ...
│   ├── layout/
│   │   ├── sidebar.tsx               # Icon sidebar navigation
│   │   ├── topbar.tsx                # Page header + user menu
│   │   └── page-shell.tsx            # Standard page wrapper with title + actions
│   ├── dashboard/
│   │   ├── compliance-score-card.tsx # Big compliance % card
│   │   ├── compliance-breakdown.tsx  # Per-category status cards
│   │   ├── recent-activity.tsx       # Activity feed
│   │   └── pending-actions.tsx       # Outstanding compliance items
│   ├── chemicals/
│   │   ├── chemical-table.tsx        # Sortable/filterable chemical list
│   │   ├── chemical-row.tsx          # Single row with compliance badge
│   │   ├── sds-upload.tsx            # PDF upload dropzone
│   │   ├── sds-viewer.tsx            # Inline PDF viewer (react-pdf)
│   │   ├── barcode-scanner.tsx       # @zxing camera scanner component
│   │   ├── chemical-type-badge.tsx   # Standard / CIP / Gas Hazard / Refrigerant badge
│   │   └── emergency-qr-card.tsx     # Emergency Quick Response Card
│   ├── deliveries/
│   │   ├── delivery-timeline.tsx     # Timeline visualization
│   │   ├── delivery-card.tsx         # Single delivery card
│   │   └── item-scan-list.tsx        # Scanned item list during receiving
│   └── shared/
│       ├── compliance-gate.tsx       # Red "SDS Required" blocker banner
│       ├── status-badge.tsx          # Compliant / Review Due / Missing SDS
│       └── empty-state.tsx           # Reusable empty state component
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                 # Browser-side Supabase client
│   │   ├── server.ts                 # Server-side Supabase client (SSR)
│   │   └── middleware.ts             # Auth middleware for protected routes
│   ├── validations/
│   │   ├── chemical.ts               # Zod schemas for chemical forms
│   │   └── delivery.ts               # Zod schemas for delivery forms
│   ├── utils.ts                      # clsx + tailwind-merge helpers
│   └── constants.ts                  # Chemical types, compliance thresholds
│
├── hooks/
│   ├── use-chemicals.ts              # Chemical data fetching hooks
│   ├── use-deliveries.ts             # Delivery data fetching hooks
│   ├── use-compliance-score.ts       # Real-time compliance score calculation
│   └── use-barcode-scanner.ts        # Barcode scanner state management
│
├── types/
│   └── database.ts                   # Supabase generated types + app types
│
├── public/
│   └── icons/                        # Static icons/images
│
├── supabase/
│   ├── migrations/                   # SQL migration files
│   │   └── 001_initial_schema.sql
│   └── seed.sql                      # Demo data for development
│
├── .env.local                        # Environment variables (not committed)
├── .env.example                      # Example env file (committed)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## 7. Environment Variables

```bash
# .env.example

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key   # server-side only, never expose to client

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=SafeCellar
```

---

## 8. Database Schema

### Overview

Multi-tenant schema using `organization_id` as the tenant key on every table. Supabase Row Level Security (RLS) policies enforce that users can only read/write rows belonging to their organization.

### SQL Schema

```sql
-- ============================================================
-- ORGANIZATIONS (tenants)
-- ============================================================
CREATE TABLE organizations (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name          TEXT NOT NULL,
  facility_type TEXT CHECK (facility_type IN ('brewery', 'winery', 'both')) NOT NULL,
  address       TEXT,
  city          TEXT,
  state         TEXT,
  zip           TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- PROFILES (extends Supabase auth.users)
-- ============================================================
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
  full_name       TEXT NOT NULL,
  role            TEXT CHECK (role IN ('admin', 'worker')) NOT NULL DEFAULT 'worker',
  phone           TEXT,
  language        TEXT DEFAULT 'en',
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CHEMICALS
-- ============================================================
CREATE TABLE chemicals (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id   UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Identity
  name              TEXT NOT NULL,
  trade_name        TEXT,                -- Supplier brand name (may differ from chemical name)
  manufacturer      TEXT,
  supplier          TEXT,
  barcode           TEXT,               -- UPC or supplier barcode scanned during intake
  cas_number        TEXT,               -- Chemical Abstracts Service registry number

  -- Classification
  chemical_type     TEXT NOT NULL DEFAULT 'standard'
                    CHECK (chemical_type IN ('standard', 'cip', 'gas_hazard', 'refrigerant')),

  -- Location
  storage_location  TEXT,               -- "Cellar B - Chemical Cage", "Brewhouse - Right Wall", etc.

  -- SDS Compliance
  sds_file_path     TEXT,               -- Supabase Storage path
  sds_version       TEXT,               -- Revision date or version from SDS document
  sds_uploaded_at   TIMESTAMPTZ,
  sds_last_verified TIMESTAMPTZ,        -- Date admin confirmed SDS still current
  sds_review_due_at TIMESTAMPTZ,        -- sds_last_verified + 12 months
  sds_status        TEXT NOT NULL DEFAULT 'missing'
                    CHECK (sds_status IN ('compliant', 'review_due', 'missing', 'outdated')),

  -- Safety Summary (extracted from SDS on upload)
  ppe_required      TEXT[],             -- ["nitrile_gloves", "face_shield", "apron"]
  hazard_class      TEXT[],             -- ["corrosive", "flammable", "asphyxiant"]
  first_aid_notes   TEXT,               -- Free text first aid protocol from SDS
  emergency_contact TEXT,               -- Manufacturer emergency phone

  -- Metadata
  notes             TEXT,
  is_active         BOOLEAN DEFAULT TRUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chemicals_org ON chemicals(organization_id);
CREATE INDEX idx_chemicals_sds_status ON chemicals(sds_status);
CREATE INDEX idx_chemicals_barcode ON chemicals(barcode);

-- ============================================================
-- DELIVERIES
-- ============================================================
CREATE TABLE deliveries (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Order info
  order_number    TEXT,
  supplier        TEXT NOT NULL,
  order_date      DATE,
  expected_date   DATE,
  delivered_date  DATE,

  -- Status
  status          TEXT NOT NULL DEFAULT 'ordered'
                  CHECK (status IN ('ordered', 'in_transit', 'delivered', 'inventory_pending', 'complete')),

  -- Notes
  notes           TEXT,
  created_by      UUID REFERENCES profiles(id),
  received_by     UUID REFERENCES profiles(id),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deliveries_org ON deliveries(organization_id);

-- ============================================================
-- DELIVERY ITEMS
-- ============================================================
CREATE TABLE delivery_items (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  delivery_id   UUID NOT NULL REFERENCES deliveries(id) ON DELETE CASCADE,
  chemical_id   UUID REFERENCES chemicals(id),  -- NULL if new/unrecognized chemical

  -- Product info
  product_name  TEXT NOT NULL,
  barcode       TEXT,
  quantity      INTEGER DEFAULT 1,              -- Number of containers
  unit          TEXT DEFAULT 'each',            -- each, gallon, liter, kg, etc.

  -- Scan status
  is_scanned    BOOLEAN DEFAULT FALSE,
  scanned_at    TIMESTAMPTZ,
  scanned_by    UUID REFERENCES profiles(id),

  -- New chemical flag
  is_new_chemical   BOOLEAN DEFAULT FALSE,      -- TRUE if barcode not found in chemicals table
  sds_review_needed BOOLEAN DEFAULT FALSE,      -- TRUE if is_new_chemical OR chemical.sds_status != 'compliant'

  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_delivery_items_delivery ON delivery_items(delivery_id);

-- ============================================================
-- SDS REVIEW QUEUE
-- ============================================================
CREATE TABLE sds_review_queue (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  chemical_id     UUID NOT NULL REFERENCES chemicals(id) ON DELETE CASCADE,
  reason          TEXT NOT NULL
                  CHECK (reason IN ('new_chemical', 'annual_review', 'supplier_change', 'formula_update')),
  status          TEXT NOT NULL DEFAULT 'pending'
                  CHECK (status IN ('pending', 'in_progress', 'resolved')),
  flagged_at      TIMESTAMPTZ DEFAULT NOW(),
  resolved_at     TIMESTAMPTZ,
  resolved_by     UUID REFERENCES profiles(id),
  notes           TEXT
);

CREATE INDEX idx_sds_review_org ON sds_review_queue(organization_id);
CREATE INDEX idx_sds_review_status ON sds_review_queue(status);

-- ============================================================
-- WORKERS (worker roster, separate from auth profiles)
-- ============================================================
-- Note: Profiles table handles users who log in.
-- Workers table is the full roster including workers who may not have accounts.
CREATE TABLE workers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  profile_id      UUID REFERENCES profiles(id),  -- NULL if no app account yet

  full_name       TEXT NOT NULL,
  role_title      TEXT,
  phone           TEXT,
  email           TEXT,
  language        TEXT DEFAULT 'en',
  start_date      DATE,
  is_active       BOOLEAN DEFAULT TRUE,
  notes           TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_workers_org ON workers(organization_id);

-- ============================================================
-- ACTIVITY LOG (audit trail)
-- ============================================================
CREATE TABLE activity_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  actor_id        UUID REFERENCES profiles(id),
  action          TEXT NOT NULL,       -- "sds_uploaded", "chemical_added", "delivery_received", etc.
  entity_type     TEXT,                -- "chemical", "delivery", "worker"
  entity_id       UUID,
  metadata        JSONB,               -- Additional context (old value, new value, etc.)
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_activity_log_org ON activity_log(organization_id);
CREATE INDEX idx_activity_log_entity ON activity_log(entity_type, entity_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE organizations    ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE chemicals        ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries       ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE sds_review_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE workers          ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log     ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user's organization_id
CREATE OR REPLACE FUNCTION get_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM profiles WHERE id = auth.uid()
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policy pattern (repeat for each table)
CREATE POLICY "org_isolation" ON chemicals
  USING (organization_id = get_org_id());

CREATE POLICY "org_isolation" ON deliveries
  USING (organization_id = get_org_id());

-- (apply same pattern to all other tables)

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER chemicals_updated_at
  BEFORE UPDATE ON chemicals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- (apply to organizations, profiles, deliveries, workers)
```

---

## 9. Authentication and Roles

### Auth Flow

1. User lands on `/login`
2. Enters email + password (Supabase email/password auth)
3. On success, Supabase issues a JWT and sets a session cookie via `@supabase/ssr`
4. Middleware (`lib/supabase/middleware.ts`) checks session on every protected route
5. If no session → redirect to `/login`
6. After login, user is redirected to `/dashboard`

### First-Time Onboarding

1. Admin signs up at `/signup`
2. Creates organization (name, facility type: brewery / winery / both, state)
3. Profile is created and linked to organization
4. Redirected to Dashboard with an onboarding checklist:
   - Add your first chemical
   - Create your first delivery
   - Invite a team member (optional)

### Roles

| Role | Can Do |
|------|--------|
| `admin` | Full CRUD on all data, invite workers, export reports, manage settings |
| `worker` | View chemicals and SDS, scan barcodes for deliveries, view assigned tasks (Phase 2) |

Role is stored on the `profiles.role` column. Enforce in RLS policies and in server-side route handlers.

### Middleware (lib/supabase/middleware.ts)

```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/chemicals', '/deliveries', '/sds-review', '/workers', '/settings']
const AUTH_ROUTES = ['/login', '/signup']

export async function middleware(request: NextRequest) {
  let response = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { /* cookie handlers */ } }
  )
  const { data: { session } } = await supabase.auth.getSession()

  const isProtected = PROTECTED_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))
  const isAuth = AUTH_ROUTES.some(r => request.nextUrl.pathname.startsWith(r))

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  if (isAuth && session) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  return response
}
```

---

## 10. Screen Inventory and Routes

### Auth Screens

| Screen | Route | Description |
|--------|-------|-------------|
| Login | `/login` | Email + password login. "Don't have an account? Sign up" link. |
| Sign Up | `/signup` | Admin account creation + organization setup (2-step). |

### Dashboard

| Screen | Route | Description |
|--------|-------|-------------|
| Compliance Dashboard | `/dashboard` | Overview: compliance score, breakdown by category, pending actions, recent activity. |

### Chemicals

| Screen | Route | Description |
|--------|-------|-------------|
| Chemical Inventory | `/chemicals` | Table of all chemicals with compliance status filter tabs. Search + filter. |
| Add Chemical | `/chemicals/new` | Two-tab form: Manual entry or Barcode Scan. |
| Chemical Detail | `/chemicals/[id]` | Full profile: identity, classification, SDS status, PPE, Emergency QR Card, SDS viewer, edit. |

### Deliveries

| Screen | Route | Description |
|--------|-------|-------------|
| Delivery Timeline | `/deliveries` | Chronological list/timeline of all deliveries. Status chips. Filter by status. |
| New Delivery | `/deliveries/new` | Create delivery order: supplier, order number, dates, add items manually. |
| Delivery Detail | `/deliveries/[id]` | Full delivery view: order details, item list with scan status, receive items flow. |

### SDS Review

| Screen | Route | Description |
|--------|-------|-------------|
| SDS Review Queue | `/sds-review` | List of all pending SDS review actions. Reason (new, annual, supplier change). Link to chemical. |

### Workers

| Screen | Route | Description |
|--------|-------|-------------|
| Worker Roster | `/workers` | List of all workers. Role, status, training completion (Phase 2 hook). |
| Worker Detail | `/workers/[id]` | Worker profile, contact info, training history (Phase 2). |

### Settings

| Screen | Route | Description |
|--------|-------|-------------|
| Organization Settings | `/settings` | Facility name, type, address, logo. Invite workers. |

---

## 11. Phase 1 — Core Feature Specs

### 11.1 Login Screen

**Route:** `/login`

**Layout:** Centered card, no sidebar. Full-page background in the brand color scheme.

**Elements:**
- SafeCellar logo + wordmark (top of card)
- Tagline: "Inspection-ready. Always."
- Email input field
- Password input field (with show/hide toggle)
- "Sign in" primary button (full width)
- "Forgot password?" link (below button)
- "New to SafeCellar? Create an account" link at bottom of card
- Error state: red inline error message for invalid credentials

**State transitions:**
- Loading: Button shows spinner
- Error: "Invalid email or password" message appears
- Success: Redirect to `/dashboard`

---

### 11.2 Dashboard

**Route:** `/dashboard`

**Purpose:** Compliance command center. Owner-operator should see their compliance status within 3 seconds of logging in. No ambiguity about what needs attention.

**Layout:** 3-column grid above the fold, full-width activity feed below.

**Components:**

**1. Compliance Score Card (top-left, large)**
- Large circular or arc gauge showing overall compliance %
- Color: green (>85%), amber (60–85%), red (<60%)
- Subtitle: "X of Y chemicals compliant"
- Secondary: "X items need attention"

**2. Compliance Breakdown (top-center + top-right, 3 smaller cards)**
- Card 1: SDS Status — "X missing / X review due / X compliant" 
- Card 2: Delivery Queue — "X deliveries pending inventory scan"
- Card 3: SDS Review Queue — "X items in review queue"
- Each card has a status icon and a "View" link

**3. Pending Actions List (middle section)**
- Prioritized list of open compliance items:
  - Missing SDS items (red badge)
  - Annual review due items (amber badge)
  - Deliveries with unscanned items (amber badge)
- Each item: chemical name / delivery, status badge, "Resolve" CTA button
- Empty state: green checkmark, "All compliance items resolved"

**4. Recent Activity Feed (bottom, full width)**
- Last 10 activity log entries in reverse chronological order
- Format: [Avatar] [Action description] · [Relative time]
- Examples: "Elena uploaded SDS for Peracetic Acid · 2h ago"

---

### 11.3 Chemical Inventory

**Route:** `/chemicals`

**Purpose:** The single source of truth for every chemical in the facility. Every chemical must be here. Every chemical must have a compliant SDS.

**Components:**

**Filter Tabs (above table):**
- All | Missing SDS | Review Due | Compliant
- Badge count on each tab (updates in real-time)

**Search:**
- Text search across: name, trade_name, manufacturer, supplier, cas_number

**Chemical Table columns:**
| Column | Notes |
|--------|-------|
| Chemical Name | Sortable. Shows trade name in smaller text below |
| Type | Chemical type badge (Standard / CIP / Gas Hazard / Refrigerant) |
| Location | Storage location text |
| SDS Status | Badge: green Compliant / amber Review Due / red Missing |
| Last Verified | Date. Shows "Never" if null |
| Actions | "View" button → detail page |

**Empty state:** "No chemicals yet. Add your first chemical to get started." + "Add Chemical" button.

**Add Chemical Button:** Top-right, primary color, "+ Add Chemical" → `/chemicals/new`

**Export Button:** "Export HazCom Report" → generates PDF of all chemicals with SDS status, PPE, and storage location. This is the document the owner hands OSHA.

---

### 11.4 Add Chemical

**Route:** `/chemicals/new`

**Two tabs:**

**Tab 1 — Manual Entry**

Form fields:
- Chemical Name* (text)
- Trade Name (text, optional — supplier brand name)
- Manufacturer* (text)
- Supplier (text)
- CAS Number (text, optional)
- Chemical Type* (select: Standard / CIP Chemical / Confined Space Gas Hazard / Refrigerant or Process Safety Chemical)
- Storage Location* (text, with common locations as autocomplete suggestions: "Cellar A", "Brewhouse", "Chemical Cage", "Walk-in Cooler")
- Notes (textarea)

**Tab 2 — Barcode Scan**

- Large camera viewfinder area using `@zxing/browser` `BrowserMultiFormatReader`
- Instruction text: "Point your camera at the barcode on the container"
- On scan success:
  - If barcode exists in system → show chemical details, option to "Add to Delivery" or "View Chemical"
  - If barcode not in system → switch to Manual Entry tab with barcode pre-populated, show blue banner: "New chemical detected. Please complete the SDS information."
- Manual barcode input fallback: "Can't scan? Enter barcode manually" text input

**After form submit:**
- Chemical created in database with `sds_status = 'missing'`
- Compliance gate is immediately shown on the new chemical's detail page
- SDS review queue item created with `reason = 'new_chemical'`
- Activity log entry created

---

### 11.5 Chemical Detail

**Route:** `/chemicals/[id]`

**Sections:**

**1. Header**
- Chemical name (large)
- Trade name (smaller, secondary)
- Chemical Type badge
- SDS Status badge (large, prominent)
- Edit button (admin only)

**2. Compliance Gate (conditional — shown when sds_status !== 'compliant')**
```
┌─────────────────────────────────────────────────────────┐
│  ⚠ SDS REQUIRED — This chemical is not compliant        │
│  Upload the Safety Data Sheet to resolve this item.     │
│  [Upload SDS PDF]                                        │
└─────────────────────────────────────────────────────────┘
```
Red background, white text. This banner does not disappear until SDS is uploaded AND verified.

**3. Chemical Information**
- Two-column grid: Manufacturer, Supplier, CAS Number, Storage Location, Barcode, Date Added

**4. SDS Management**
- SDS Status indicator (large badge + description)
- SDS Version / Revision Date (text input, filled from document)
- SDS Date (when uploaded)
- Last Verified (date + "Mark as Verified Today" button for annual reviews)
- Review Due Date (calculated: last_verified + 365 days)
- Upload dropzone: "Drag SDS PDF here or click to browse"
- If SDS uploaded: "View SDS" button → opens react-pdf viewer in a modal

**5. PPE Requirements**
- Checklist of PPE items required for this chemical
- Icons: gloves, face shield, apron, goggles, respirator, etc.
- Editable by admin

**6. Emergency Quick Response Card**
- Card with dark background (stands out for urgent use)
- Chemical name + CAS number
- 3-step first aid protocol (free text, filled from SDS)
- Emergency contact phone number
- "Print Emergency Card" button → generates printable wallet-card PDF

**7. Hazard Classification**
- GHS hazard pictograms (if applicable)
- Hazard class tags: corrosive, flammable, oxidizer, asphyxiant, etc.

**8. Activity History (bottom)**
- Log of all actions on this chemical: created, SDS uploaded, verified, updated, etc.

---

### 11.6 Delivery Timeline

**Route:** `/deliveries`

**Purpose:** Complete audit trail of every chemical order placed and received. Supports OSHA traceability requirement.

**Layout:**
- Filter bar: All | Ordered | In Transit | Pending Inventory | Complete
- Chronological list (most recent first)
- Each delivery is a card showing: order number, supplier, status chip, expected date, item count, "View" link

**Delivery Status Flow:**
```
Ordered → In Transit → Delivered → Inventory Pending → Complete
```
- "Inventory Pending" = delivery received but items not yet scanned into inventory
- "Complete" = all items scanned and accounted for

---

### 11.7 New Delivery

**Route:** `/deliveries/new`

**Form fields:**
- Supplier* (text)
- Order Number (text, optional)
- Order Date* (date picker)
- Expected Delivery Date (date picker)
- Notes (textarea)

**Add Items section:**
- "Add Item" button opens inline form:
  - Product Name*
  - Barcode (optional, can scan)
  - Quantity (number)
  - Unit (select: each / gallon / liter / kg / box)
  - Link to existing chemical (auto-suggest from chemicals table by name/barcode)
- Items appear in list below as they're added
- Items can be removed before saving

**Submit:** Creates delivery with status `ordered`. Redirects to delivery detail page.

---

### 11.8 Delivery Detail and Receiving Flow

**Route:** `/deliveries/[id]`

**Sections:**

**1. Header**
- Order number + supplier
- Status badge (with timeline progress bar showing current step)
- Dates: ordered, expected, delivered (editable)
- "Mark as Delivered" button (when status is `ordered` or `in_transit`)

**2. Items List**
- Table: Product Name | Chemical | Qty | Unit | Scanned? | Action
- Scanned items show green checkmark + scanned timestamp
- Unscanned items show "Scan" button
- New chemical items (no match in system) show orange "New — SDS Required" badge

**3. Receiving Mode (activated when status is `delivered`)**
- "Start Inventory Scan" button activates the barcode scanner
- Camera viewfinder opens
- Each scan:
  - Matches barcode to item in delivery → marks as scanned
  - If barcode matches a known chemical → links item to chemical record
  - If barcode is unknown → triggers new chemical flow
- Progress indicator: "Scanned 4 of 7 items"
- "Finish Receiving" button → marks delivery `complete` if all scanned, or `inventory_pending` if items remain

**4. New Chemical Alert (conditional)**
- If any delivery items are flagged as new chemicals: amber banner
- "X new chemicals detected in this delivery. Review SDS requirements."
- List of flagged items with "Complete SDS" links

---

### 11.9 SDS Review Queue

**Route:** `/sds-review`

**Purpose:** Single list of all outstanding SDS compliance actions across the facility. The owner should be able to work through this list top to bottom to clear their compliance backlog.

**Table columns:**
| Column | Notes |
|--------|-------|
| Chemical | Name + type badge |
| Reason | "New Chemical" / "Annual Review Due" / "Supplier Change" / "Formula Update" |
| Flagged | Date flagged |
| Status | Pending / In Progress |
| Action | "Resolve" button → opens chemical detail SDS section |

**Filter:** All | Pending | In Progress

**Bulk actions (admin):** Select multiple → "Mark as In Progress"

---

### 11.10 Worker Roster

**Route:** `/workers`

**Purpose:** Record of all workers at the facility. Used for training assignments in Phase 2.

**Table columns:** Name, Role, Phone, Start Date, Active Status

**Add Worker:**
- Name, role title, phone, email, language preference, start date
- Option to send app invite (sends Supabase invite email)

**Note for Phase 1:** Training history column shows "Phase 2" placeholder. Workers can log in and view chemical SDS sheets and emergency cards — this is their primary Phase 1 value.

---

## 12. Phase 2 — Future

> Not in MVP scope. Documented here for the coding agent to understand the full product vision and avoid architectural decisions that would block Phase 2.

### 12.1 Equipment and Procedure Builder

**What it is:** A structured knowledge base where the facility admin can document every piece of equipment and the procedures related to it.

**Data model additions:**
```sql
CREATE TABLE equipment (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL,
  name            TEXT NOT NULL,        -- "Brewing Tank 3", "Must Pump 2", "Canning Line"
  equipment_type  TEXT,                 -- "fermentation_tank", "pump", "canning_line", etc.
  location        TEXT,
  risk_tier       TEXT NOT NULL DEFAULT 'medium'
                  CHECK (risk_tier IN ('low', 'medium', 'high', 'critical')),
  notes           TEXT,
  image_path      TEXT,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE procedures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipment_id    UUID NOT NULL REFERENCES equipment(id),
  organization_id UUID NOT NULL,
  name            TEXT NOT NULL,        -- "LOTO Procedure", "CIP Cleaning", "Confined Space Entry"
  procedure_type  TEXT NOT NULL
                  CHECK (procedure_type IN ('loto', 'cip', 'confined_space', 'general', 'maintenance')),
  risk_tier       TEXT NOT NULL DEFAULT 'medium',
  estimated_duration_minutes INTEGER,
  inactivity_alert_minutes INTEGER,     -- For confined space: alert if no check-in after X minutes
  is_active       BOOLEAN DEFAULT TRUE,
  version         INTEGER DEFAULT 1,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE procedure_steps (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  procedure_id  UUID NOT NULL REFERENCES procedures(id) ON DELETE CASCADE,
  step_number   INTEGER NOT NULL,
  title         TEXT NOT NULL,
  description   TEXT,
  image_path    TEXT,                   -- Annotated photo
  voice_note_path TEXT,                 -- Audio recording
  chemical_id   UUID REFERENCES chemicals(id),  -- Linked chemical (CIP step references chemical)
  requires_confirmation BOOLEAN DEFAULT FALSE,   -- Worker must tap confirm before proceeding
  is_hazard_step BOOLEAN DEFAULT FALSE,
  hazard_note   TEXT
);
```

### 12.2 Task Assignment Dashboard

- Admin assigns tasks to workers: equipment + procedure + due date/time
- Worker receives mobile notification, opens task, follows step-by-step procedure
- "Mark Complete" button only available after all required steps confirmed
- Task timer starts when worker opens procedure
- If `procedure.risk_tier = 'critical'` AND worker inactive for `inactivity_alert_minutes` → alert fires to admin dashboard

### 12.3 Inactivity Alert (Dead Man's Switch)

This is the software-based proxy for CO2 monitoring. Designed for confined space tank entry.

**How it works:**
1. Admin assigns task: "Tank 3 Cleaning — Confined Space Entry Procedure"
2. Worker opens task on phone, confirms entry checklist
3. System starts timer
4. If worker hasn't interacted with the app in `inactivity_alert_minutes` (configurable, default 10 for confined space):
   - Push notification sent to worker: "Are you OK? Tap to confirm."
   - If no response within 2 minutes: Admin alert fires immediately
   - Alert appears as red urgent card on admin dashboard: "Worker [Name] — Tank 3 — No activity for 12 minutes. Confirm status immediately."

**This solves CB-08 (CO2 Real-Time Monitoring, Impact 80%) without any IoT hardware.** The proxy isn't perfect but it's deployable immediately and gives facilities a meaningful safety net.

---

## 13. Product Roadmap

### Phase 1 — OSHA Ready (MVP) — 8–12 Weeks

**Goal:** A craft brewery or winery can go from zero to OSHA-inspection-ready in 30 days.

| Feature | Priority | Notes |
|---------|----------|-------|
| Authentication + Org Setup | P0 | Login, signup, first-run onboarding |
| Chemical Inventory | P0 | Add, list, detail, SDS upload, compliance gate |
| Barcode Scanning | P0 | Add chemical via barcode scan on mobile |
| SDS Upload and Viewer | P0 | PDF upload to Supabase Storage, inline viewer |
| Delivery Timeline | P0 | Create delivery, mark received, scan items |
| SDS Review Queue | P0 | Consolidated action list |
| Compliance Dashboard | P0 | Score card, breakdown, pending actions |
| Emergency QR Card | P0 | Per-chemical first aid card, printable |
| HazCom Report Export | P0 | PDF export for OSHA compliance |
| Worker Roster | P1 | Basic roster, invite workers |
| Annual SDS Review Reminders | P1 | Email notification at 11 months |
| Activity Log | P1 | Audit trail for all compliance actions |

### Phase 1.5 — LabelOps (Winery Add-on) — 6–8 Weeks

| Feature | Priority |
|---------|----------|
| SKU/Product Registry | P0 |
| COLA Status Tracking | P0 |
| January 2025 Allergen Compliance Audit | P0 |
| Fining Agent Registry | P0 |
| TTB Excise Records | P1 |

### Phase 2 — Equipment and Task Safety — 12–16 Weeks

| Feature | Priority |
|---------|----------|
| Equipment Registry | P0 |
| Procedure Builder (with photos, notes, voice) | P0 |
| Task Assignment Dashboard | P0 |
| Mobile Worker App (PWA) | P0 |
| Inactivity Alert (Dead Man's Switch) | P0 |
| Task Timer and Progress Tracking | P1 |
| Multilingual Support (English/Spanish) | P1 |

### Phase 3 — Environmental + IoT — Future

| Feature | Notes |
|---------|-------|
| Wastewater BOD Tracking | CB-05, Impact 64% |
| CO2 Sensor Integration | CB-08, requires IoT hardware |
| EPA Report Generation | NPDES discharge reporting |

---

## 14. Key User Flows

### Flow 1: First Login → Compliance Baseline

```
/login
  → [auth success]
  → /signup/org-setup (if new user)
      → Create org: name, facility type, state
      → [submit]
  → /dashboard
      → Shows onboarding checklist: "Add your first chemical"
      → Compliance Score: 0% (no chemicals, none to be compliant on)
```

### Flow 2: Add Chemical Manually

```
/chemicals → "+ Add Chemical" → /chemicals/new
  → Tab: Manual Entry
  → Fill form: name, type, location, etc.
  → [Submit]
  → Chemical created, sds_status = 'missing'
  → Redirect to /chemicals/[id]
  → Compliance Gate banner shows immediately
  → SDS Review Queue item created automatically
```

### Flow 3: Add Chemical via Barcode Scan

```
/chemicals/new → Tab: Barcode Scan
  → Camera activates
  → Point at barcode → scan event fires
  → [If known barcode] → "Chemical already in system" modal → option to view or add to delivery
  → [If unknown barcode] → Switch to Manual tab, barcode pre-filled, blue "New Chemical" banner
  → Fill remaining fields → [Submit]
  → Same as Flow 2 from here
```

### Flow 4: Upload SDS and Clear Compliance Gate

```
/chemicals/[id]
  → Compliance Gate visible (red banner)
  → Click "Upload SDS PDF"
  → File picker / dropzone
  → PDF uploads to Supabase Storage
  → Admin fills: SDS Version, SDS Revision Date
  → [Save]
  → sds_status → 'compliant'
  → Compliance Gate disappears
  → Last Verified = today, Review Due = today + 365 days
  → Activity log: "SDS uploaded for [chemical name]"
  → Dashboard compliance score recalculates
```

### Flow 5: Create Delivery and Receive Items

```
/deliveries → "+ New Delivery" → /deliveries/new
  → Fill supplier, order number, dates
  → Add items: product name, barcode, qty
  → [Submit] → delivery created, status = 'ordered'
  → /deliveries/[id]
  
  [When shipment arrives:]
  → "Mark as Delivered" → status = 'delivered'
  → "Start Inventory Scan" → camera activates
  → Scan item barcodes one by one
    → Known chemical → item marked scanned, linked to chemical record
    → Unknown barcode → "New Chemical" flow triggered inline
  → All items scanned → "Finish Receiving" → status = 'complete'
  → [If new chemicals detected] → SDS review queue items auto-created
```

### Flow 6: OSHA Inspection Prep (The Core Value Prop)

```
/dashboard
  → Check compliance score (is it green?)
  → Click "Pending Actions" to clear any open items
  
/chemicals
  → Filter by "Missing SDS" → resolve any gaps
  → Filter by "Review Due" → mark verified or upload new SDS
  
/chemicals → "Export HazCom Report"
  → PDF generated with: all chemicals, SDS status, storage locations, PPE requirements
  → Print and hand to OSHA inspector
  
Total time from login to inspection-ready: ~20 minutes if all SDS are uploaded
```

---

## 15. API Routes

### Chemicals

```
GET    /api/chemicals              → List all chemicals for org (with filters)
POST   /api/chemicals              → Create new chemical
GET    /api/chemicals/[id]         → Get chemical by ID
PATCH  /api/chemicals/[id]         → Update chemical
DELETE /api/chemicals/[id]         → Soft delete (set is_active = false)
```

### SDS

```
POST   /api/sds/upload             → Upload SDS PDF to Supabase Storage, update chemical record
GET    /api/sds/[chemical_id]      → Get signed URL for SDS PDF viewing
POST   /api/sds/verify/[chemical_id] → Mark SDS as verified today (updates last_verified)
```

### Deliveries

```
GET    /api/deliveries             → List deliveries for org
POST   /api/deliveries             → Create delivery
GET    /api/deliveries/[id]        → Get delivery with items
PATCH  /api/deliveries/[id]        → Update delivery status, dates
POST   /api/deliveries/[id]/items/scan → Record barcode scan for delivery item
```

### Barcode

```
GET    /api/barcode/[code]         → Look up barcode in chemicals table. Returns { found: boolean, chemical?: Chemical }
```

### Reports

```
GET    /api/reports/hazcom         → Generate HazCom compliance report PDF (server-side PDF generation)
```

### Workers

```
GET    /api/workers                → List workers for org
POST   /api/workers                → Add worker
PATCH  /api/workers/[id]           → Update worker
POST   /api/workers/invite         → Send Supabase invite email to worker
```

---

## 16. Component Library Conventions

### Using shadcn/ui

Initialize shadcn/ui with:
```bash
npx shadcn-ui@latest init
```

Use the following components from shadcn/ui (copy into `components/ui/`):
`Button`, `Card`, `CardHeader`, `CardContent`, `CardFooter`, `Input`, `Label`, `Select`, `Badge`, `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `Table`, `TableHeader`, `TableRow`, `TableCell`, `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger`, `Toast`, `Toaster`, `Separator`, `Avatar`, `DropdownMenu`, `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`

### Form Validation

All forms use `react-hook-form` + `zod` via `@hookform/resolvers/zod`:

```typescript
const chemicalSchema = z.object({
  name: z.string().min(1, 'Chemical name is required'),
  chemical_type: z.enum(['standard', 'cip', 'gas_hazard', 'refrigerant']),
  storage_location: z.string().min(1, 'Storage location is required'),
  manufacturer: z.string().min(1, 'Manufacturer is required'),
  supplier: z.string().optional(),
  cas_number: z.string().optional(),
  notes: z.string().optional(),
})
```

### Data Fetching

Use Supabase client directly in Server Components for initial data load. Use custom hooks (`hooks/use-chemicals.ts`) in Client Components for reactive state.

### Toast Notifications

Use the shadcn/ui `Toaster` component for all success/error feedback:
- Success: green toast, 3 second auto-dismiss
- Error: red toast, 6 second auto-dismiss, manual dismiss button
- Warning: amber toast for compliance actions (SDS flagged, new chemical detected)

### Loading States

Every data fetch should have a loading skeleton. Use `shadcn/ui Skeleton` component. Never show a blank screen — always show the skeleton shape of the UI while data loads.

---

*PRD Version 1.0 — SafeCellar — 2026-05-24*  
*Grounded in brewery-pain-points-deep.md + winery-pain-points-deep.md + craft-beverage.md + use-cases.md + solution-concepts.md*
