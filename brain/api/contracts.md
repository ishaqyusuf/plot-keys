# API Contracts

## Purpose
This file tracks request and response shape conventions.

## How To Use
- Update when public or internal API contract patterns become concrete.
- Keep examples short and schema-oriented.

## Initial Contract Rules
- Validate input and output at service boundaries.
- Preserve tenant scoping in all contracts.
- Prefer explicit enums for status-driven workflows.
- Use structured payloads for website sections and AI outputs.
- Current API scaffold can derive request auth context from headers before full Better Auth session wiring lands.
- Auth mutations now return structured session handoff payloads instead of redirect responses:
  - `redirectTo`
  - auth-flow-specific metadata such as onboarding defaults for sign-up
  - `sessionToken` only when the auth step is complete enough to persist a dashboard session immediately
- `auth.signUp` now returns verification-first metadata rather than an active session:
  - `email`
  - `onboarding`
  - `redirectTo`
  - `verificationToken`
- Store API-facing Zod schemas in `apps/api/src/schemas/*` rather than shared utility packages so transport contracts stay API-owned and discoverable.
- Workspace/dashboard mutations now use API-owned schemas in `apps/api/src/schemas/workspace.schema.ts` for:
  - onboarding completion
  - template draft creation
  - site-field updates
  - publish requests
  - smart-fill requests
- Current workspace mutation responses stay intentionally small and redirect-friendly:
  - `configId` for builder mutations that should route the dashboard back to a specific configuration
  - `syncedCount` for tenant-domain sync operations
- Billing checkout contracts now allow the dashboard to pass the active host callback URL into `workspace.initializeCheckout` so provider redirects return to the correct local, preview, or production dashboard origin.
- Billing repair uses a dashboard server action that accepts a Paystack `reference` and redirects to `/billing/callback?reference=...`; the callback verifies the transaction with Paystack before mutating plan state.
- Team invite contracts now support an optional `workRole` alongside the required access `role` so employee invites can carry standardized workplace persona.

## Planned Enums
- `LeadStatus`: `NEW`, `CONTACTED`, `NEGOTIATING`, `CLOSED`
- `ClientStage`: `NEW_LEAD`, `INTERESTED`, `NEGOTIATING`, `CLOSED`
- `PaymentMethod`: `PAYSTACK`, `FLUTTERWAVE`, `STRIPE`, `BANK_TRANSFER`, `CASH`
- `MembershipRole`: `PLATFORM_ADMIN`, `OWNER`, `ADMIN`, `AGENT`, `STAFF`
- `WorkRole`: `OPERATIONS`, `SALES_AGENT`, `SALES_MANAGER`, `HR`, `FINANCE`, `MARKETING`, `PROJECT_MANAGER`, `EXECUTIVE`
- `PlotStatus`: `available`, `held`, `reserved`, `sold`, `blocked`
- `PlotReservationStatus`: `draft`, `held`, `processing`, `expired`, `cancelled`, `approved`, `rejected`

## Planned Estate Allocation Contract Rules
- Estate and plot contracts must remain tenant-scoped at every boundary.
- Layout coordinates should be stored in a normalized, resolution-independent shape so layout images can be re-rendered without corrupting hit targets.
- Plot list endpoints should support:
  - filter-based queries for table views
  - viewport-based queries for map views
- Reservation mutations must validate preconditions:
  - plot is still available
  - hold has not expired
  - caller belongs to the current tenant context
- Customer-facing estate responses should expose published layout data only.

## Planned Estate Allocation Payload Shapes

### `public.getEstateBySlug`
```json
{
  "estate": {
    "id": "uuid",
    "title": "Hutu Exclusive Phase III",
    "slug": "hutu-exclusive-phase-3",
    "location": "Ibeju-Lekki, Lagos",
    "phaseLabel": "Phase III",
    "description": "Serviced estate with residential and commercial plots.",
    "heroImageUrl": "https://...",
    "availabilitySummary": {
      "available": 128,
      "held": 7,
      "reserved": 16,
      "sold": 42
    },
    "layout": {
      "imageUrl": "https://...",
      "width": 1688,
      "height": 2347,
      "version": 3
    }
  }
}
```

### `public.listEstatePlots`
```json
{
  "plots": [
    {
      "id": "uuid",
      "plotCode": "A-12",
      "block": "A",
      "street": "Radiance Lane",
      "sizeSqm": 500,
      "price": "₦25,000,000",
      "type": "residential",
      "status": "available",
      "coordinates": {
        "type": "polygon",
        "points": [[0.12, 0.08], [0.16, 0.08], [0.16, 0.11], [0.12, 0.11]]
      },
      "tags": ["corner-piece"]
    }
  ],
  "nextCursor": null
}
```

### `portal.submitPlotReservation`
```json
{
  "plotId": "uuid",
  "backupPlotIds": ["uuid", "uuid"],
  "note": "Prefer north-facing plot close to the boulevard.",
  "redirectTo": "/portal/plots"
}
```

## Structured Builder Contract Example
```json
{
  "page": "home",
  "sections": [
    {
      "type": "hero_banner",
      "config": {
        "title": "Luxury Apartments",
        "subtitle": "Find your dream home",
        "backgroundImage": "hero.jpg"
      }
    }
  ]
}
```

## AI Output Contract Rules
- JSON only for structured website generation flows
- Validate against section schema before persistence
- Reject unrecognized section types
