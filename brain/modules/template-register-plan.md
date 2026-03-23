# Template Register Plan

## Created: 2026-03-23

## Purpose
Canonical specification for the plan-based template register. This defines the 18 structured templates (6 families × 3 plans), their folder layout, page inventories, content injection contracts, and all design standards.

---

## Context

All 45 existing templates ship with only a Home page and differentiate primarily by color, font, and copy defaults — not by structural page depth or company-type fit. This register introduces a new layer of structurally unique, company-type-based templates with full multi-page inventories, explicit content injection contracts, and a formal placeholder system for the template marketplace.

---

## Naming Convention

All template family names follow the project's established **Arabic/MENA naming accent** (consistent with existing templates: Zara, Nura, Hana, Reem, Rania, Omar, Khalid, Faisal, Dina, etc.). Family names are Arabic words with contextual meaning.

Template keys use the pattern `{family}-{plan}`:
- `noor-starter`, `noor-plus`, `noor-pro`
- `bana-starter`, `bana-plus`, `bana-pro`
- etc.

---

## The 6 Template Families

| Family Key | Arabic Name | Meaning | Maps To `businessType` | Character |
|------------|------------|---------|----------------------|-----------|
| `agency` | **Noor** (نور) | Light | `agency` | Multi-agent firm, full inventory, listings-first |
| `developer` | **Bana** (بنى) | Builder | `developer` | Project/construction-led, development brand |
| `manager` | **Wafi** (وافي) | Loyal/Trustworthy | `property_manager` | Landlord services, rental ops, tenant-facing |
| `solo` | **Faris** (فارس) | Knight | `independent_agent` | Single agent, personal brand, trust-led |
| `luxury` | **Thuraya** (ثريا) | Pleiades/Precious | `luxury_firm` | Editorial, prestige, high-end portfolio |
| `rental` | **Sakan** (سكن) | Dwelling/Residence | `rental_business` | Rental-first, tenant acquisition |

---

## Folder Structure

```
packages/section-registry/src/register/
  noor/
    common/
      content-schema.ts    ← all contentKey defs: label, defaultValue, placeholderValue, aiEnabled
      data-map.ts          ← maps TenantResource → section config item shape for Noor
      footer.ts            ← footer link groups, shared across all plan tiers
      nav.ts               ← navigation links + mobile Sheet/Drawer config
      placeholder-data.ts  ← placeholder listings, agents, stats for "template" browse mode
    starter/
      content.ts           ← default content seeds for Noor Starter
      pages.ts             ← full page inventory with section slots
      theme.ts             ← accent color, font pairing, style preset for Starter
    plus/
      content.ts
      pages.ts
      theme.ts
    pro/
      content.ts
      pages.ts
      theme.ts
    index.ts               ← exports all 3 variants + family metadata
  bana/   [same structure]
  wafi/   [same structure]
  faris/  [same structure]
  thuraya/ [same structure]
  sakan/  [same structure]
  index.ts                 ← master registry: familyRegistry, resolvePage, lookup helpers
```

---

## Universal Pages (All Families, All Plans)

These pages are included in every template regardless of family or plan tier:

| Page | Slug | Notes |
|------|------|-------|
| Home | `/` | Family-specific section composition |
| Login | `/login` | Buyer/renter account login on tenant's public site |
| Sign Up | `/signup` | Buyer/renter account creation |
| 404 | `/404` | Error state |
| Privacy Policy | `/privacy` | Legal |
| Terms of Service | `/terms` | Legal |

> Login/Signup are for **public site visitors** (buyers, renters), not platform dashboard auth.

---

## User Account Pages (Plus and Pro, listing-heavy families)

| Page | Slug | Description | Families |
|------|------|-------------|---------|
| Saved Listings | `/saved` | Buyer wishlist — favorited properties | Noor, Faris, Thuraya, Sakan, Wafi |
| Inquiry Basket | `/inquire` | Cart equivalent — bundled multi-property inquiry | Noor, Thuraya, Sakan |

---

## Page Inventories Per Family

### Noor (Agency)

| Page | Slug | Starter | Plus | Pro |
|------|------|---------|------|-----|
| Home | `/` | ✅ | ✅ | ✅ |
| Listings | `/listings` | ✅ | ✅ | ✅ |
| Property Detail | `/listings/[slug]` | ✅ | ✅ | ✅ |
| About | `/about` | ✅ | ✅ | ✅ |
| Contact | `/contact` | ✅ | ✅ | ✅ |
| Agents | `/agents` | — | ✅ | ✅ |
| Agent Detail | `/agents/[slug]` | — | ✅ | ✅ |
| Services | `/services` | — | ✅ | ✅ |
| Area Guides | `/areas` | — | ✅ | ✅ |
| Saved Listings | `/saved` | — | ✅ | ✅ |
| Inquiry Basket | `/inquire` | — | ✅ | ✅ |
| Blog | `/blog` | — | — | ✅ |
| Blog Post | `/blog/[slug]` | — | — | ✅ |
| Events / Open House | `/events` | — | — | ✅ |
| Resources | `/resources` | — | — | ✅ |
| + Universal | | ✅ | ✅ | ✅ |

### Bana (Developer)

| Page | Slug | Starter | Plus | Pro |
|------|------|---------|------|-----|
| Home | `/` | ✅ | ✅ | ✅ |
| Projects | `/projects` | ✅ | ✅ | ✅ |
| Project Detail | `/projects/[slug]` | ✅ | ✅ | ✅ |
| About | `/about` | ✅ | ✅ | ✅ |
| Contact | `/contact` | ✅ | ✅ | ✅ |
| Gallery | `/gallery` | — | ✅ | ✅ |
| Services | `/services` | — | ✅ | ✅ |
| Service Detail | `/services/[slug]` | — | ✅ | ✅ |
| Investors | `/investors` | — | — | ✅ |
| Blog | `/blog` | — | — | ✅ |
| Blog Post | `/blog/[slug]` | — | — | ✅ |
| + Universal | | ✅ | ✅ | ✅ |

### Wafi (Manager)

| Page | Slug | Starter | Plus | Pro |
|------|------|---------|------|-----|
| Home | `/` | ✅ | ✅ | ✅ |
| Properties | `/properties` | ✅ | ✅ | ✅ |
| Property Detail | `/properties/[slug]` | ✅ | ✅ | ✅ |
| About | `/about` | ✅ | ✅ | ✅ |
| Contact | `/contact` | ✅ | ✅ | ✅ |
| Services | `/services` | — | ✅ | ✅ |
| FAQ | `/faq` | — | ✅ | ✅ |
| Saved Listings | `/saved` | — | ✅ | ✅ |
| For Landlords | `/landlords` | — | — | ✅ |
| For Tenants | `/tenants` | — | — | ✅ |
| Blog | `/blog` | — | — | ✅ |
| + Universal | | ✅ | ✅ | ✅ |

### Faris (Solo / Independent Agent)

| Page | Slug | Starter | Plus | Pro |
|------|------|---------|------|-----|
| Home | `/` | ✅ | ✅ | ✅ |
| Listings | `/listings` | ✅ | ✅ | ✅ |
| Property Detail | `/listings/[slug]` | ✅ | ✅ | ✅ |
| About | `/about` | ✅ | ✅ | ✅ |
| Contact | `/contact` | ✅ | ✅ | ✅ |
| Services | `/services` | — | ✅ | ✅ |
| Testimonials | `/testimonials` | — | ✅ | ✅ |
| Saved Listings | `/saved` | — | ✅ | ✅ |
| Blog | `/blog` | — | — | ✅ |
| Blog Post | `/blog/[slug]` | — | — | ✅ |
| Resources | `/resources` | — | — | ✅ |
| + Universal | | ✅ | ✅ | ✅ |

### Thuraya (Luxury)

| Page | Slug | Starter | Plus | Pro |
|------|------|---------|------|-----|
| Home | `/` | ✅ | ✅ | ✅ |
| Portfolio | `/portfolio` | ✅ | ✅ | ✅ |
| Property Detail | `/portfolio/[slug]` | ✅ | ✅ | ✅ |
| About | `/about` | ✅ | ✅ | ✅ |
| Contact | `/contact` | ✅ | ✅ | ✅ |
| Services | `/services` | — | ✅ | ✅ |
| Area Guides | `/areas` | — | ✅ | ✅ |
| Saved Listings | `/saved` | — | ✅ | ✅ |
| Inquiry Basket | `/inquire` | — | ✅ | ✅ |
| Private Sales | `/private-sales` | — | — | ✅ |
| Insights / Blog | `/insights` | — | — | ✅ |
| Press | `/press` | — | — | ✅ |
| + Universal | | ✅ | ✅ | ✅ |

### Sakan (Rental)

| Page | Slug | Starter | Plus | Pro |
|------|------|---------|------|-----|
| Home | `/` | ✅ | ✅ | ✅ |
| Rentals | `/rentals` | ✅ | ✅ | ✅ |
| Property Detail | `/rentals/[slug]` | ✅ | ✅ | ✅ |
| About | `/about` | ✅ | ✅ | ✅ |
| Contact | `/contact` | ✅ | ✅ | ✅ |
| Services | `/services` | — | ✅ | ✅ |
| How It Works | `/how-it-works` | — | ✅ | ✅ |
| FAQ | `/faq` | — | ✅ | ✅ |
| Saved Listings | `/saved` | — | ✅ | ✅ |
| Inquiry Basket | `/inquire` | — | ✅ | ✅ |
| For Landlords | `/landlords` | — | — | ✅ |
| Tenant Resources | `/tenant-resources` | — | — | ✅ |
| Blog | `/blog` | — | — | ✅ |
| + Universal | | ✅ | ✅ | ✅ |

---

## Home Page Section Compositions Per Family

Each family's home page leads differently. Plus and Pro accumulate sections on top of Starter.

### Noor (Agency) — listings-first
- **Starter:** HeroBanner → FeaturedListings → MarketStats → Story → CTA
- **Plus adds:** AgentShowcase + Testimonials
- **Pro adds:** Newsletter

### Bana (Developer) — project/brand-first
- **Starter:** HeroBanner → Story → ServiceHighlights → WhyChooseUs → CTA
- **Plus adds:** PropertyGrid + Testimonials
- **Pro adds:** Newsletter + Contact

### Wafi (Manager) — service/trust-first
- **Starter:** HeroSearch → ServiceHighlights → WhyChooseUs → FAQ → CTA
- **Plus adds:** PropertyGrid + Contact
- **Pro adds:** Testimonials + Newsletter

### Faris (Solo) — personal brand/story-first
- **Starter:** HeroBanner → Story → Testimonials → CTA
- **Plus adds:** ServiceHighlights + FeaturedListings
- **Pro adds:** AgentShowcase + Newsletter

### Thuraya (Luxury) — editorial/portfolio-first
- **Starter:** HeroBanner → Story → FeaturedListings → CTA
- **Plus adds:** Testimonials + AgentShowcase
- **Pro adds:** Newsletter + ServiceHighlights

### Sakan (Rental) — search/availability-first
- **Starter:** HeroSearch → PropertyGrid → WhyChooseUs → CTA
- **Plus adds:** ServiceHighlights + FAQ + Contact
- **Pro adds:** Testimonials + Newsletter

---

## Content Injection Contract

### Two Content Channels

| Channel | What | Where stored | Editable in builder |
|---------|------|-------------|--------------------|
| Static text | Headlines, subtitles, CTAs, story copy | `TenantContentRecord` (key-value) | Yes — via `EditableText` |
| Live data | Listings, agents, projects, testimonials | DB records | No — managed from dashboard |

### SectionSlot Extended Type

```ts
type TenantResource =
  | "listings" | "agents" | "projects" | "testimonials"
  | "blog_posts" | "contact" | "services" | "area_guides"
  | null;

type SectionSlot = {
  id: string;
  sectionType: string;
  label: string;
  sortOrder: number;
  defaultEnabled: boolean;
  contentKeys: string[];           // static text — EditableText wraps these only
  dataSource?: TenantResource;     // live DB resource — display-only, never editable inline
  requiredResources?: TenantResource[]; // section auto-hides if any of these are empty
};
```

### Content Field Definition (in common/content-schema.ts)

```ts
type ContentFieldDef = {
  contentKey: string;
  label: string;
  aiEnabled: boolean;
  defaultValue: string;      // real draft seed for new tenants
  placeholderValue: string;  // shown in "template" browse mode only, never stored
};
```

### Resolver

```ts
// Returns ordered, visibility-resolved, data-populated section configs
// for a given page — ready to drop into the renderer.
function resolvePage(
  familyKey: string,
  planTier: TemplateTier,
  pageKey: string,
  tenant: TenantSnapshot,
  renderMode: RenderMode,
): ResolvedPageConfig
```

In `"template"` render mode, `resolvePage` uses `placeholderValue` for content and `placeholder-data.ts` for live data items instead of real DB data.

---

## Render Modes (Updated — 4 Modes)

`RenderMode` must be extended to include `"template"`:

```ts
type RenderMode = "live" | "draft" | "preview" | "template";
```

| Mode | Data | Navigation | Editable | Forms |
|------|------|-----------|---------|-------|
| `live` | Real tenant data | Real routing | No | Real submission |
| `draft` | Real tenant data | Builder-managed | Yes — inline | Intercepted |
| `preview` | Real tenant data | Builder-managed | No | Intercepted |
| `template` | Placeholder data | Intercepted → inline panels | No | Intercepted |

---

## EditableText Behaviour (Draft Mode)

Current `EditableText` is partial — it supports inline editing but is missing the AI icon and action bar. Planned upgrade (separate task from register creation):

```
Hover:   amber ring + [✦ AI] icon in top-right (only if aiEnabled + AI credits available)
Click:   ring-primary + [✓ Save] [✕ Discard] action bar
AI icon: opens generation panel — shows suggested text — [Use this] / [Try again]
Accept:  writes to draft contentRecord only, not live
```

EditableText wraps **only contentKeys fields**. Dynamic item fields (listing titles, agent names, etc.) never get EditableText wrappers.

---

## Click Interception (Template / Preview Mode)

A `ClickGuard` context layer wraps the page in non-live modes:

| Click target | Behaviour |
|-------------|-----------|
| Internal nav links (`/about`, `/contact`) | Builder internal page router — no real navigation |
| Listing / agent card | `InlineOverview` slide-up panel with item data |
| CTA buttons | Swallowed — non-intrusive toast "Preview mode — actions disabled" |
| Form submit | Intercepted — "Form preview — not submitted" |

`InlineOverview` panel in `"template"` mode shows placeholder item data + "Install template" CTA.
`InlineOverview` panel in `"draft"` / `"preview"` mode shows real property data + "Enquire" action.

---

## Three Non-Negotiable Standards

### 1. Editable Boundary
- Only `contentKeys` fields get `EditableText` wrappers.
- `dataSource` item fields are always display-only in the builder.
- AI generation targets `contentKeys` only.

### 2. UI System Split
- **Section components** (tenant-visible): raw Tailwind + `var(--pk-*)` CSS variables from `WebsiteRuntimeProvider`. No imports from `@plotkeys/ui`.
- **Builder overlay components** (action bars, panels, ClickGuard, AI panel): `@plotkeys/ui` (shadcn/ui, New York style, Lucide icons).
- **register `common/` builder-facing files**: `@plotkeys/ui`.

### 3. Mobile Responsive Baseline (all families, all plans)

| Element | Mobile (320px) | Tablet (768px) | Desktop (1440px) |
|---------|---------------|---------------|-----------------|
| Property grid | 1 col | 2 cols | 3 cols |
| Agent grid | 1 col | 2 cols | 3–4 cols |
| Hero layout | Stacked | Stacked | Two-column |
| Navigation | Hamburger (Sheet) | Hamburger or inline | Full inline |
| CTA buttons | Full width | Auto | Auto |
| Headings | `text-3xl` | `text-4xl` | `text-5xl`–`text-6xl` |

Mobile nav (Sheet/Drawer from `@plotkeys/ui`) is **mandatory** in every family's `common/nav.ts`. Responsiveness is a baseline requirement — not a plan tier feature.

---

## Template Keys Reference

| Key | Family | Plan | Tier |
|-----|--------|------|------|
| `noor-starter` | Noor / Agency | Starter | starter |
| `noor-plus` | Noor / Agency | Plus | plus |
| `noor-pro` | Noor / Agency | Pro | pro |
| `bana-starter` | Bana / Developer | Starter | starter |
| `bana-plus` | Bana / Developer | Plus | plus |
| `bana-pro` | Bana / Developer | Pro | pro |
| `wafi-starter` | Wafi / Manager | Starter | starter |
| `wafi-plus` | Wafi / Manager | Plus | plus |
| `wafi-pro` | Wafi / Manager | Pro | pro |
| `faris-starter` | Faris / Solo | Starter | starter |
| `faris-plus` | Faris / Solo | Plus | plus |
| `faris-pro` | Faris / Solo | Pro | pro |
| `thuraya-starter` | Thuraya / Luxury | Starter | starter |
| `thuraya-plus` | Thuraya / Luxury | Plus | plus |
| `thuraya-pro` | Thuraya / Luxury | Pro | pro |
| `sakan-starter` | Sakan / Rental | Starter | starter |
| `sakan-plus` | Sakan / Rental | Plus | plus |
| `sakan-pro` | Sakan / Rental | Pro | pro |

---

## Open Items / Separate Tasks (Not In Register Scope)

These are design decisions made during planning but deferred to separate implementation tasks:

| Item | Notes |
|------|-------|
| `EditableText` AI icon + action bar upgrade | Upgrade `editing-primitives.tsx` |
| `ClickGuard` context component | New shared component in section-registry |
| `InlineOverview` panel component | New shared component in section-registry |
| `onAiGenerate` callback wiring | Builder layer (dashboard app) |
| Mobile nav implementation | `common/nav.ts` defines the contract; Sheet/Drawer component already in `@plotkeys/ui` |
