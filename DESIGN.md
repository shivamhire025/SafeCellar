# SafeCellar — Design System

> **Version:** 1.0  
> **Date:** 2026-05-24  
> **Purpose:** Design language reference for all UI development. Coding agents must follow this document for every visual decision.  
> **Reference:** Quixotic fintech dashboard — clean white cards, dark green primary, light gray background, rounded charts, icon sidebar.

---

## Design Philosophy

SafeCellar is a compliance tool, not a consumer app. The visual language communicates three things:

1. **Authority** — This is a serious tool for serious regulatory requirements. Dark green as primary evokes safety, compliance, and trust. Not playful, not minimal-startup-white.
2. **Clarity** — Owner-operators are non-technical users who are often stressed when opening this app. Every screen tells you exactly what's wrong and what to do about it.
3. **Urgency where needed** — Red compliance gates and amber review warnings must be impossible to miss. But the baseline state (everything compliant) is calm and green.

---

## 1. Color System

### Brand Colors

```css
/* globals.css — CSS Custom Properties */
:root {
  /* Primary — Dark Green */
  --color-primary-900: #0D3D21;
  --color-primary-800: #145C31;
  --color-primary-700: #1A6B3A;     /* PRIMARY — main brand green */
  --color-primary-600: #1F7D44;
  --color-primary-500: #268F50;
  --color-primary-400: #3DAD68;
  --color-primary-300: #65C287;
  --color-primary-200: #A3D9B8;
  --color-primary-100: #D4EFE0;
  --color-primary-50:  #EBF7F1;

  /* Neutral — Slate */
  --color-neutral-900: #111827;
  --color-neutral-800: #1F2937;
  --color-neutral-700: #374151;
  --color-neutral-600: #4B5563;
  --color-neutral-500: #6B7280;
  --color-neutral-400: #9CA3AF;
  --color-neutral-300: #D1D5DB;
  --color-neutral-200: #E5E7EB;
  --color-neutral-100: #F3F4F6;
  --color-neutral-50:  #F9FAFB;

  /* Semantic — Status Colors */
  --color-success:        #16A34A;   /* Green 600 */
  --color-success-light:  #DCFCE7;   /* Green 100 */
  --color-warning:        #D97706;   /* Amber 600 */
  --color-warning-light:  #FEF3C7;   /* Amber 100 */
  --color-danger:         #DC2626;   /* Red 600 */
  --color-danger-light:   #FEE2E2;   /* Red 100 */
  --color-info:           #2563EB;   /* Blue 600 */
  --color-info-light:     #DBEAFE;   /* Blue 100 */

  /* Surface */
  --color-bg-page:        #F3F4F6;   /* Page background — light gray */
  --color-bg-card:        #FFFFFF;   /* Card background — pure white */
  --color-bg-sidebar:     #0D3D21;   /* Sidebar — darkest green */
  --color-sidebar-active: #1A6B3A;   /* Active nav item in sidebar */
  --color-sidebar-hover:  #145C31;   /* Hover state in sidebar */
  --color-sidebar-text:   #A3D9B8;   /* Default icon/text in sidebar */
  --color-sidebar-active-text: #FFFFFF; /* Active nav text */

  /* Text */
  --color-text-primary:   #111827;   /* Headings, primary labels */
  --color-text-secondary: #6B7280;   /* Subtext, descriptions */
  --color-text-muted:     #9CA3AF;   /* Placeholder, disabled */
  --color-text-inverted:  #FFFFFF;   /* Text on dark backgrounds */
}
```

### Tailwind Config

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#EBF7F1',
          100: '#D4EFE0',
          200: '#A3D9B8',
          300: '#65C287',
          400: '#3DAD68',
          500: '#268F50',
          600: '#1F7D44',
          700: '#1A6B3A',   // primary
          800: '#145C31',
          900: '#0D3D21',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
} satisfies Config
```

### Color Usage Rules

| Context | Color |
|---------|-------|
| Page background | `bg-[#F3F4F6]` / `bg-neutral-100` |
| Card background | `bg-white` |
| Sidebar background | `bg-[#0D3D21]` |
| Primary button | `bg-brand-700 hover:bg-brand-800` |
| Primary text | `text-neutral-900` |
| Secondary text | `text-neutral-500` |
| Compliance gate (missing SDS) | `bg-red-50 border-l-4 border-red-600 text-red-800` |
| Warning (review due) | `bg-amber-50 border-l-4 border-amber-500 text-amber-800` |
| Success (compliant) | `text-green-600 bg-green-50` |
| Disabled state | `text-neutral-400 bg-neutral-100` |

---

## 2. Typography

### Font

**Primary font:** Inter (Google Fonts or system fallback)

```html
<!-- In app/layout.tsx <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### Type Scale

| Name | Size | Weight | Line Height | Usage |
|------|------|--------|-------------|-------|
| `display` | 30px / 1.875rem | 700 | 1.2 | Page hero titles (rare) |
| `heading-1` | 24px / 1.5rem | 700 | 1.3 | Page titles |
| `heading-2` | 20px / 1.25rem | 600 | 1.3 | Section titles, card headers |
| `heading-3` | 16px / 1rem | 600 | 1.4 | Sub-section titles, form group labels |
| `body-lg` | 16px / 1rem | 400 | 1.5 | Primary body copy |
| `body` | 14px / 0.875rem | 400 | 1.5 | Default body, table rows |
| `body-sm` | 13px / 0.8125rem | 400 | 1.4 | Secondary info, metadata |
| `caption` | 12px / 0.75rem | 400 | 1.3 | Timestamps, footnotes |
| `label` | 12px / 0.75rem | 500 | 1 | Form labels, badges |
| `mono` | 13px / 0.8125rem | 400 | 1.4 | Barcode values, CAS numbers |

### Tailwind Typography Classes

```
display:  text-[30px] font-bold
h1:       text-2xl font-bold        (24px)
h2:       text-xl font-semibold     (20px)
h3:       text-base font-semibold   (16px)
body-lg:  text-base font-normal
body:     text-sm font-normal       (14px)
body-sm:  text-[13px] font-normal
caption:  text-xs font-normal       (12px)
label:    text-xs font-medium
mono:     text-[13px] font-mono
```

---

## 3. Spacing System

Use Tailwind's default 4px base spacing (1 unit = 4px):

| Token | Value | Usage |
|-------|-------|-------|
| `space-1` | 4px | Tight gaps between related elements |
| `space-2` | 8px | Small padding, icon gaps |
| `space-3` | 12px | Compact form fields, dense lists |
| `space-4` | 16px | Standard padding, card inner padding |
| `space-5` | 20px | Comfortable element spacing |
| `space-6` | 24px | Section padding, card padding |
| `space-8` | 32px | Large section gaps |
| `space-10` | 40px | Page-level padding |
| `space-12` | 48px | Hero spacing |

### Layout Spacing Rules

- **Page padding:** `px-6 py-6` (24px all around on desktop)
- **Card padding:** `p-6` (24px inner padding)
- **Form field gap:** `gap-4` (16px between fields)
- **Card grid gap:** `gap-4` (16px between cards on desktop)
- **Section gap:** `gap-6` or `gap-8`

---

## 4. Border Radius and Shadows

### Border Radius

```
Rounded corners everywhere. No sharp edges.

Buttons:          rounded-md     (6px)
Input fields:     rounded-md     (6px)
Cards:            rounded-xl     (12px)
Badges/chips:     rounded-full
Modal dialogs:    rounded-2xl    (16px)
Alert banners:    rounded-lg     (8px)
Sidebar nav items: rounded-lg   (8px)
Chemical type badges: rounded-md (6px)
```

### Box Shadows

```css
/* Card shadow — subtle elevation */
.shadow-card {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 
              0 1px 2px rgba(0, 0, 0, 0.04);
}

/* Elevated card (hover state or modal) */
.shadow-elevated {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 
              0 2px 4px -1px rgba(0, 0, 0, 0.05);
}

/* Sidebar shadow (right edge) */
.shadow-sidebar {
  box-shadow: 1px 0 0 rgba(255, 255, 255, 0.06);
}
```

In Tailwind: use `shadow-sm` for default cards, `shadow-md` for elevated states.

---

## 5. Layout System

### Global Layout (Dashboard)

```
┌──────────────────────────────────────────────────────────────┐
│                         TOPBAR                               │
│  ┌──────────┐  ┌──────────────────────────────────────────┐  │
│  │          │  │                                          │  │
│  │ SIDEBAR  │  │              PAGE CONTENT                │  │
│  │ (64px)   │  │         (remaining width)                │  │
│  │          │  │                                          │  │
│  │          │  │                                          │  │
│  └──────────┘  └──────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```

- **Sidebar width:** 64px (icon-only, expands to 220px on hover — optional in MVP)
- **Topbar height:** 60px
- **Page content:** scrollable, `overflow-y-auto`
- **Background:** `bg-neutral-100` (light gray)
- **Max content width:** `max-w-7xl mx-auto` for centered content on large screens

### Sidebar Spec

```
Background: bg-[#0D3D21] (darkest green)
Width: 64px (collapsed) / 220px (expanded)
Icons: 24px, centered
Active item: bg-brand-700 rounded-lg mx-2
Hover: bg-brand-800

Nav items (top-to-bottom):
  🏠  Dashboard      → /dashboard
  ⚗️  Chemicals      → /chemicals
  🚚  Deliveries     → /deliveries
  📋  SDS Review     → /sds-review
  👥  Workers        → /workers
  ⚙️  Settings       → /settings (bottom, pinned)

Bottom:
  User avatar + initials
  "Sign out" on click
```

### Topbar Spec

```
Background: bg-white
Height: 60px
Border-bottom: 1px solid neutral-200
Content:
  Left: Page title (h2, text-neutral-900)
  Right: [Notification bell] [User avatar + name]
```

### Page Shell Pattern

Every page inside the dashboard uses a consistent shell:

```tsx
// components/layout/page-shell.tsx
export function PageShell({ title, description, actions, children }) {
  return (
    <div className="min-h-screen bg-neutral-100 p-6">
      {/* Page Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">{title}</h1>
          {description && (
            <p className="text-sm text-neutral-500 mt-1">{description}</p>
          )}
        </div>
        {actions && <div className="flex gap-3">{actions}</div>}
      </div>
      {children}
    </div>
  )
}
```

---

## 6. Component Patterns

### Cards

```tsx
// Standard data card
<div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
  <h3 className="text-base font-semibold text-neutral-900 mb-4">Card Title</h3>
  {/* content */}
</div>
```

Card variants:
- **Default:** `border border-neutral-200 shadow-sm`
- **Elevated (hover/active):** `shadow-md border-neutral-300`
- **Danger (compliance gate):** `border-l-4 border-red-500 bg-red-50`
- **Warning:** `border-l-4 border-amber-500 bg-amber-50`
- **Success:** `border-l-4 border-green-500 bg-green-50`

### Buttons

```tsx
// Primary button
<button className="bg-brand-700 hover:bg-brand-800 text-white font-medium
                   text-sm px-4 py-2 rounded-md transition-colors duration-150">
  Add Chemical
</button>

// Secondary button
<button className="bg-white hover:bg-neutral-50 text-neutral-700 font-medium
                   text-sm px-4 py-2 rounded-md border border-neutral-300
                   transition-colors duration-150">
  Export Report
</button>

// Danger button
<button className="bg-red-600 hover:bg-red-700 text-white font-medium
                   text-sm px-4 py-2 rounded-md transition-colors duration-150">
  Delete
</button>

// Ghost button
<button className="text-brand-700 hover:bg-brand-50 font-medium
                   text-sm px-3 py-2 rounded-md transition-colors duration-150">
  View Details
</button>
```

Button sizes:
- **sm:** `text-xs px-3 py-1.5`
- **default:** `text-sm px-4 py-2`
- **lg:** `text-base px-5 py-2.5`

### Badges / Status Chips

```tsx
// Compliance status badges
const statusStyles = {
  compliant:   "bg-green-100 text-green-700 border border-green-200",
  review_due:  "bg-amber-100 text-amber-700 border border-amber-200",
  missing:     "bg-red-100 text-red-700 border border-red-200",
  outdated:    "bg-red-100 text-red-700 border border-red-200",
}

// Chemical type badges
const typeStyles = {
  standard:    "bg-neutral-100 text-neutral-600",
  cip:         "bg-blue-100 text-blue-700",
  gas_hazard:  "bg-orange-100 text-orange-700",
  refrigerant: "bg-purple-100 text-purple-700",
}

// Badge shape
<span className={`
  inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium
  ${statusStyles[status]}
`}>
  <span className="w-1.5 h-1.5 rounded-full bg-current" />
  {label}
</span>
```

### Input Fields

```tsx
<div className="flex flex-col gap-1.5">
  <label className="text-xs font-medium text-neutral-700">
    Chemical Name <span className="text-red-500">*</span>
  </label>
  <input
    className="w-full px-3 py-2 text-sm bg-white border border-neutral-300 rounded-md
               text-neutral-900 placeholder-neutral-400
               focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-brand-700
               disabled:bg-neutral-50 disabled:text-neutral-400
               transition-colors duration-150"
    placeholder="e.g. Sodium Hydroxide"
  />
  {/* Error state */}
  <p className="text-xs text-red-600">This field is required</p>
</div>
```

### Tables

```tsx
<div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
  <table className="w-full text-sm">
    <thead className="bg-neutral-50 border-b border-neutral-200">
      <tr>
        <th className="px-4 py-3 text-left text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          Chemical Name
        </th>
        {/* more headers */}
      </tr>
    </thead>
    <tbody className="divide-y divide-neutral-100">
      <tr className="hover:bg-neutral-50 transition-colors duration-100">
        <td className="px-4 py-3 text-neutral-900 font-medium">Sodium Hydroxide</td>
        {/* more cells */}
      </tr>
    </tbody>
  </table>
</div>
```

### Compliance Gate Banner

This is the most important UI pattern in the product. It must be impossible to miss.

```tsx
// components/shared/compliance-gate.tsx
export function ComplianceGate({ chemicalName }: { chemicalName: string }) {
  return (
    <div className="rounded-lg border-l-4 border-red-600 bg-red-50 p-4 flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">
        <AlertTriangle className="h-5 w-5 text-red-600" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-red-800">
          SDS Required — This chemical is not compliant
        </h3>
        <p className="text-sm text-red-700 mt-1">
          Upload the Safety Data Sheet (SDS) for <strong>{chemicalName}</strong> to clear
          this compliance item. This flag will not clear automatically.
        </p>
      </div>
      <Button variant="danger-outline" size="sm">
        Upload SDS
      </Button>
    </div>
  )
}
```

### Empty States

```tsx
// components/shared/empty-state.tsx
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-4">
        {/* icon — lucide-react, text-brand-700 */}
      </div>
      <h3 className="text-base font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-500 max-w-sm mb-6">{description}</p>
      {action}
    </div>
  )
}
```

---

## 7. Icon System

**Library:** `lucide-react` exclusively. No other icon libraries.

**Sizes:**
- Navigation sidebar: `h-5 w-5` (20px)
- Inline with text: `h-4 w-4` (16px)
- Status indicators: `h-4 w-4`
- Hero/card headers: `h-6 w-6` (24px)
- Empty states: `h-8 w-8` (32px)

**Key icon mappings:**

| Feature | Icon | Import |
|---------|------|--------|
| Dashboard | `LayoutDashboard` | lucide-react |
| Chemicals | `FlaskConical` | lucide-react |
| Deliveries | `Truck` | lucide-react |
| SDS Review | `ClipboardCheck` | lucide-react |
| Workers | `Users` | lucide-react |
| Settings | `Settings` | lucide-react |
| Add / Create | `Plus` | lucide-react |
| Edit | `Pencil` | lucide-react |
| Delete | `Trash2` | lucide-react |
| Upload | `Upload` | lucide-react |
| Download / Export | `Download` | lucide-react |
| Scan barcode | `ScanBarcode` | lucide-react |
| Compliance gate | `AlertTriangle` | lucide-react |
| Compliant | `CheckCircle2` | lucide-react |
| Missing / Error | `XCircle` | lucide-react |
| Warning / Review | `AlertCircle` | lucide-react |
| Chemical | `FlaskConical` | lucide-react |
| CIP Chemical | `Droplets` | lucide-react |
| Gas Hazard | `Wind` | lucide-react |
| Emergency / First Aid | `HeartPulse` | lucide-react |
| PDF / Document | `FileText` | lucide-react |
| Calendar / Date | `Calendar` | lucide-react |
| Timer | `Timer` | lucide-react |
| User / Worker | `User` | lucide-react |
| Search | `Search` | lucide-react |
| Filter | `SlidersHorizontal` | lucide-react |
| Activity log | `Activity` | lucide-react |
| Location | `MapPin` | lucide-react |

---

## 8. Data Visualization

### Compliance Score (Dashboard)

The compliance score is the hero visual element. Use a semi-circular arc gauge built with SVG or recharts' `RadialBarChart`.

**Color rules:**
- 85–100% → `#16A34A` (green)
- 60–84% → `#D97706` (amber)
- 0–59% → `#DC2626` (red)

```tsx
// Simple SVG arc gauge (no external dependency needed)
// Large number centered inside arc
// Color determined by score value
```

### Bar Charts (Delivery Timeline, Activity)

Use `recharts` `BarChart`. Style:
- Bar fill: `brand-700` (#1A6B3A)
- Grid lines: `neutral-200`, very light
- Axis text: `neutral-500`, 12px
- Rounded top corners on bars: `radius={[4, 4, 0, 0]}`
- No chart border/box — floats on white card background
- Tooltips: white background, `shadow-md`, `rounded-lg`, `text-sm`

**Note from reference image:** The Quixotic dashboard uses diagonal hatching pattern on bars. Implement this with an SVG pattern fill:

```tsx
// In the recharts BarChart:
<defs>
  <pattern id="brandHatch" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(45)">
    <line x1="0" y1="0" x2="0" y2="6" stroke="#1A6B3A" strokeWidth="2.5" strokeOpacity="0.7" />
  </pattern>
</defs>
<Bar dataKey="value" fill="url(#brandHatch)" radius={[4, 4, 0, 0]} />
```

### Line Charts

Use `recharts` `LineChart` for delivery/activity trends.
- Line color: `brand-700`
- Line width: `strokeWidth={2}`
- Dot: `fill="white" stroke="brand-700" strokeWidth={2} r={4}`
- Smooth curve: `type="monotone"`
- Area fill below line: `brand-50` with 40% opacity

### Stat Cards (KPI tiles)

```tsx
<div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-6">
  <div className="flex items-center justify-between mb-2">
    <span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
      Missing SDS
    </span>
    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
      <AlertTriangle className="h-4 w-4 text-red-600" />
    </div>
  </div>
  <div className="text-3xl font-bold text-neutral-900">7</div>
  <p className="text-xs text-neutral-500 mt-1">chemicals need SDS upload</p>
</div>
```

---

## 9. Form Patterns

### Form Layout

```tsx
// Standard form layout
<form className="space-y-6">
  {/* Section */}
  <div>
    <h3 className="text-base font-semibold text-neutral-900 mb-4">Chemical Identity</h3>
    <div className="grid grid-cols-2 gap-4">
      <FormField name="name" label="Chemical Name" required />
      <FormField name="trade_name" label="Trade Name" />
    </div>
  </div>

  {/* Divider between sections */}
  <hr className="border-neutral-200" />

  {/* Another section */}
  <div>
    <h3 className="text-base font-semibold text-neutral-900 mb-4">Classification</h3>
    {/* fields */}
  </div>

  {/* Form actions — always at bottom */}
  <div className="flex justify-end gap-3 pt-2">
    <Button variant="secondary">Cancel</Button>
    <Button type="submit" variant="primary">Save Chemical</Button>
  </div>
</form>
```

### Select / Dropdown

Use shadcn/ui `Select` component. Consistent height with inputs (`py-2`). Same border and focus styles.

### File Upload Dropzone

```tsx
<div className={`
  border-2 border-dashed rounded-lg p-8 text-center
  transition-colors duration-150 cursor-pointer
  ${isDragging
    ? 'border-brand-500 bg-brand-50'
    : 'border-neutral-300 hover:border-brand-400 hover:bg-neutral-50'
  }
`}>
  <Upload className="h-8 w-8 text-neutral-400 mx-auto mb-3" />
  <p className="text-sm font-medium text-neutral-700">
    Drop SDS PDF here, or <span className="text-brand-700">click to browse</span>
  </p>
  <p className="text-xs text-neutral-400 mt-1">PDF files only, max 25MB</p>
</div>
```

---

## 10. Status Indicators

### Compliance Status System

The compliance status appears as a badge on every chemical. Three states:

| State | Badge Style | Meaning |
|-------|------------|---------|
| `compliant` | Green pill, `✓ Compliant` | SDS uploaded, verified within 12 months |
| `review_due` | Amber pill, `⚠ Review Due` | SDS uploaded but past 12-month mark |
| `missing` | Red pill, `✕ SDS Missing` | No SDS on file — compliance gate active |
| `outdated` | Red pill, `✕ SDS Outdated` | Flagged as outdated by admin |

### Delivery Status System

| State | Badge Style |
|-------|------------|
| `ordered` | Neutral gray |
| `in_transit` | Blue |
| `delivered` | Amber (received but not scanned) |
| `inventory_pending` | Amber pulsing dot |
| `complete` | Green |

### Activity Indicators

Online/active status: green dot `w-2 h-2 rounded-full bg-green-500`
Inactive: gray dot `w-2 h-2 rounded-full bg-neutral-300`

---

## 11. Login Screen Specification

**Route:** `/login`

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│    Page background: bg-neutral-100 (light gray)              │
│                                                              │
│         ┌────────────────────────────────────────┐          │
│         │                                        │          │
│         │   [Logo + SC wordmark]                 │          │
│         │                                        │          │
│         │   Inspection-ready. Always.             │          │
│         │   text-neutral-500, text-sm, centered  │          │
│         │                                        │          │
│         │   ────────────────────────────         │          │
│         │                                        │          │
│         │   Email address                        │          │
│         │   [                            ]       │          │
│         │                                        │          │
│         │   Password                             │          │
│         │   [                          👁 ]      │          │
│         │                                        │          │
│         │   [Error message — red text]           │          │
│         │                                        │          │
│         │   [  Sign in  ← full width btn  ]      │          │
│         │                                        │          │
│         │   Forgot your password?                │          │
│         │   (text-sm, text-brand-700, centered)  │          │
│         │                                        │          │
│         │   ────────────────────────────         │          │
│         │                                        │          │
│         │   New to SafeCellar? Create account    │          │
│         │   (text-sm, centered)                  │          │
│         │                                        │          │
│         └────────────────────────────────────────┘          │
│         Card: bg-white, rounded-2xl, shadow-md              │
│         Width: max-w-sm (384px), centered vertically         │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Logo:** SafeCellar text in `text-brand-700` font-bold, with a small `FlaskConical` icon to the left. No image asset needed for MVP.

**Sign in button:** `bg-brand-700 hover:bg-brand-800 text-white w-full py-2.5 rounded-md font-medium`

**Loading state:** Button text replaced with spinner `<Loader2 className="animate-spin h-4 w-4 mx-auto" />`

---

## 12. Animation and Transition Guidelines

**Principle:** Functional transitions only. No decorative animations.

```css
/* Standard transition for all interactive elements */
transition-colors duration-150    /* Color changes — buttons, hovers */
transition-all duration-200       /* Size/layout changes — dropdowns */
transition-opacity duration-200   /* Show/hide — toasts, modals */
```

**Specific patterns:**
- Button hover/active: `duration-150` color transition only
- Modal open/close: fade-in `opacity-0 → opacity-100` + scale `scale-95 → scale-100`, `duration-200`
- Toast notifications: slide in from right, `duration-200`
- Barcode scanner overlay: fade-in `duration-300`
- Loading skeleton: `animate-pulse` from Tailwind
- Compliance gate banner: appears immediately, no animation (urgency — don't soften it)

---

## 13. Mobile Responsiveness

The primary admin interface is desktop. However, workers use the app on mobile for barcode scanning and SDS viewing.

### Breakpoints (Tailwind defaults)

```
sm:  640px   (not used much — jump straight to md)
md:  768px   (tablet/mobile landscape — stack columns)
lg:  1024px  (desktop — full sidebar + multi-column)
xl:  1280px  (wide desktop — max-w-7xl content)
```

### Mobile-specific rules

- **Sidebar:** On `< md`, sidebar becomes a bottom navigation bar (5 icons)
- **Tables:** On `< md`, use card-based list layout instead of table rows
- **Barcode scanner:** Full-screen camera overlay on mobile
- **Chemical detail:** Single column on mobile, two columns on desktop
- **Forms:** Single column on mobile, two columns on desktop

### Barcode Scanner Mobile Pattern

```tsx
// Full screen camera view on mobile
<div className="fixed inset-0 z-50 bg-black flex flex-col">
  <div className="flex items-center justify-between p-4 bg-black/80">
    <button onClick={close} className="text-white">
      <X className="h-6 w-6" />
    </button>
    <span className="text-white font-medium text-sm">Scan Barcode</span>
    <div className="w-6" /> {/* spacer */}
  </div>
  <div className="flex-1 relative">
    <video ref={videoRef} className="w-full h-full object-cover" />
    {/* Scan target overlay */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-64 h-32 border-2 border-white rounded-lg opacity-70" />
    </div>
  </div>
  <p className="text-white text-center text-sm p-4 bg-black/80">
    Point camera at barcode on container
  </p>
</div>
```

---

## 14. HazCom Report PDF Style

When exporting the HazCom compliance report (what gets handed to OSHA):

- Header: SafeCellar logo left, organization name + address right
- Generation date and "Prepared for OSHA Inspection" subtitle
- Table: Chemical Name | Type | CAS | Location | SDS Status | SDS Version | PPE Required
- Color coding in PDF: green row = compliant, red row = missing, amber row = review due
- Footer: "Generated by SafeCellar on [date]. All SDS documents on file."
- Use a server-side PDF library (recommend `@react-pdf/renderer` for React-native PDF generation in Next.js)

---

## 15. shadcn/ui Theme Override

In `components/ui/` generated files, override the default blue accent with brand green:

```css
/* globals.css — shadcn/ui CSS variable overrides */
:root {
  --primary: 150 60% 27%;          /* brand-700 in HSL */
  --primary-foreground: 0 0% 100%;
  --ring: 150 60% 27%;             /* focus ring = brand color */
}
```

This ensures all shadcn/ui components (focus rings, selected states, switch toggles, etc.) use the brand green without manually overriding every component.

---

*DESIGN.md Version 1.0 — SafeCellar — 2026-05-24*  
*Reference: Quixotic fintech dashboard — white cards, dark green primary, light gray page bg, icon sidebar, diagonal hatched bar charts*
