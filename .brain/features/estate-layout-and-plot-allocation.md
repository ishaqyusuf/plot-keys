# Estate Launch, Plan Import & Land Presale

## Purpose
This file documents the estate launch workflow for land-focused tenants. An estate is a grouped land-listing campaign: a company launches a new estate presale, imports the estate plan, maps available land listings/plots, publishes a strong presale offer, and manages customer purchase requests through a shared pipeline.

## Goal
- Remove the manual WhatsApp plus PDF plus phone-call workflow used for plot selection.
- Let companies create home or land listings with fields that match the listing type.
- Let companies group land listings into an estate launch with presale pricing, offer copy, payment-plan details, and launch timing.
- Let companies import estate plans from PDF, PNG, or JPG and map land listings onto the visual plan.
- Let customers choose land listings/plots from a visual estate plan with clear availability states.
- Add purchase, reservation, allocation, and processing workflows on top of the existing customer portal foundation.

## Current Problem
- Estate companies often share scanned or exported layout files with handwritten notes, rotated pages, and color-coded legends.
- Customers must zoom, rotate, and ask staff for every availability check.
- Staff manually track temporary holds, payments, and allocation promises outside the product.
- The current PlotKeys listing model is property-centric and home-biased: land listings should not ask for bedrooms/bathrooms, and estate presales need grouping, plan import, and purchase pipeline tools.

## Product Direction
- Keep the listing surface as the parent domain.
- Treat `Property` as the existing database name for a public listing until a future rename to `Listing` is worth the migration.
- Support two primary listing types in the product UI:
  - Home listing
  - Land listing
- Add an `Estate` launch layer for grouped land listings, presale campaigns, estate plan import, and layout-driven sales.
- A land plot inside an estate should still behave like a listing wherever possible: it can appear in inventory, connect to CRM, receive customer purchase interest, and participate in analytics.
- Reuse the customer portal auth, save, offer, and customer records as the foundation for purchase requests, reservations, and allocation flows.

## Scope

### Included
- Home and land listing forms that adapt fields by listing type.
- Estate launch records managed from the dashboard.
- Grouping land listings under an estate launch.
- Presale offer details: launch title, presale deal, payment plan, price-from, launch start/end timing.
- Layout upload from PDF, PNG, or JPG.
- Layout normalization: crop, rotate, orient, and version.
- Plot/listing drawing and mapping on top of the layout canvas.
- Land listing metadata and bulk editing.
- Public estate pages with interactive plot selection.
- Customer shortlist, primary selection, and backup choices.
- Shared listing purchase pipeline for normal listings and estate presales.
- Hold, reservation, processing, approval, and release workflow.
- Staff queue for purchase/reservation review and allocation decisions.
- Audit trail for listing/plot status changes.

### Excluded
- Full OCR automation as a launch requirement.
- AI auto-detection of plot boundaries as a launch requirement.
- Native payment-provider orchestration as a phase-1 dependency.
- Legal document authoring automation in the first release.
- Offline-first field-ops workflows.

## User Flow

### Company Admin / Sales Ops
1. Create a new estate in the dashboard.
2. Upload the estate layout or start a new blank layout.
3. Normalize the layout image so the canvas has a consistent coordinate system.
4. Draw plots or use bulk row tools to map inventory quickly.
5. Assign plot metadata such as code, block, street, size, price, type, and tags.
6. Review legend colors and availability states.
7. Publish the estate page.
8. Monitor customer holds and reservation submissions.
9. Approve, reject, release, or convert reservations into allocated plots.

### Customer
1. Open the public estate page.
2. Read estate overview and availability summary.
3. Launch the interactive plot picker.
4. Zoom, pan, search, and filter by size, budget, type, and availability.
5. Select a primary plot and optional backup plots.
6. Sign in or create a portal account if required.
7. Submit a reservation request and proceed to documentation or payment steps.
8. Track status in the customer portal.

## Phased Delivery

### Phase 0 — Foundation and Model Boundary
- Confirm listings are the sellable units and estates are grouped land-listing launch campaigns.
- Keep the database `Property` name for now, but use "Listing" in the product UI.
- Add type-aware listing forms: home listings show bedroom/bathroom fields; land listings show land details, title/access information, and estate context.
- Add feature gating for estate launch and plan allocation capability by plan tier if needed.
- Define canonical status model for listing purchase requests, holds, reservations, and allocations.
- Decide whether staff can convert a reserved land listing into a customer-owned asset directly or only through purchase approval.

### Phase 1 — Listing Foundation
- Update listing create/edit UX around `home` and `land` product types.
- Keep mapping to existing enum values initially:
  - `residential` -> Home
  - `land` -> Land
- Hide bedrooms/bathrooms for land listings.
- Add land-specific fields either directly on `Property` or through a metadata/extension table:
  - size
  - size unit
  - title type
  - survey status
  - zoning/use
  - road access
  - topography
  - allocation status
- Update public listing pages to render home and land details differently.

### Phase 2 — Estate Launch Core
- Add `Estate` CRUD in the dashboard as a Listings sub-workflow.
- Allow land listings to be assigned to an estate launch.
- Add land listing table with filters, search, and status badges scoped to an estate.
- Support estate overview fields:
  - title
  - slug
  - location
  - phase label
  - hero image
  - description
  - presale offer title
  - presale price-from
  - discount/deal copy
  - payment plan summary
  - launch start/end
  - publish state
- Support estate-grouped land listing fields:
  - listing/plot code
  - block
  - street
  - size
  - price
  - land use/type
  - facing
  - corner-premium flags
  - tags
  - availability/purchase status

### Phase 3 — Layout Import and Builder
- Upload PDF and image sources.
- Convert source files into normalized layout images.
- Add canvas with pan, zoom, and layer controls.
- Support listing/plot drawing:
  - rectangle tool
  - polygon tool
  - multi-select
  - drag handles
  - label toggle
- Support operator efficiency tools:
  - duplicate row
  - auto-number
  - bulk assign size
  - bulk price
  - bulk status update
  - status paintbrush
- Version layout changes so published estates are not broken by edits in progress.

### Phase 4 — Customer Picker and Purchase Flow
- Add public estate detail page on tenant-site.
- Add interactive plot picker with legend and filters.
- Add land listing side panel with price, size, block, facing, tags, and status.
- Add shortlist and backup-choice behavior.
- Add timed hold before full submission.
- Add customer purchase/reservation submission and portal tracking.
- Add notifications for hold expiry, reservation received, and approval outcome.

### Phase 5 — Staff Processing and Allocation
- Add shared dashboard purchase pipeline queue for both normal listings and estate presales.
- Add review actions:
  - approve
  - reject
  - request more information
  - release hold
  - promote backup choice
- Add status history for auditability.
- Add customer-facing status timeline.
- Add ownership/allocation record output that can later connect to payments and documents.

### Phase 6 — Assisted Operations and Automation
- OCR and assisted import suggestions for plot numbers and repeated rows.
- Suggest repeated grid patterns to accelerate plot mapping.
- Auto-recommend best available plots by budget and preferences.
- Add waitlist behavior for held or sold plots.
- Add document and payment workflow automation after reservation approval.

## Data Model

### Existing / Near-Term Entities
- `Property`
  - current database model for a public listing; product UI should call this "Listing"
- `Estate`
  - grouped land-listing launch campaign for a development, estate, or phase
- `EstateLayout`
  - uploaded source file, normalized image, orientation, version, and canvas metadata
- `Plot`
  - transitional structured inventory record representing one selectable land unit within an estate
  - long-term direction: converge each sellable plot with a land `Property`/Listing, or explicitly link `Plot` to `Property`

### Planned Shared Pipeline Entities
- `PurchaseRequest`
  - customer workflow record for interest, hold, processing, approval, rejection, and completion
- `PurchaseChoice`
  - primary and backup listing selections tied to a request
- `ListingStatusHistory` / `PlotStatusHistory`
  - immutable audit trail of changes to status, assignee, and timestamps
- `ListingDocument` / `PlotDocument`
  - listing-specific legal or supporting assets

### Planned Relationships
- `Company 1:N Property`
- `Company 1:N Estate`
- `Estate 1:N land Property` or `Estate 1:N Plot` with explicit listing linkage
- `Estate 1:N EstateLayout`
- `Customer 1:N PurchaseRequest`
- `PurchaseRequest 1:N PurchaseChoice`
- `Property 1:N PurchaseChoice`
- `Property 1:N ListingStatusHistory`
- `Property 1:N ListingDocument`

### Planned Enums
- `ListingKind`
  - `home`
  - `land`
- `EstatePublishState`
  - `draft`
  - `published`
  - `archived`
- `ListingPurchaseStatus` / `PlotStatus`
  - `available`
  - `held`
  - `reserved`
  - `sold`
  - `blocked`
- `PurchaseRequestStatus`
  - `draft`
  - `held`
  - `processing`
  - `expired`
  - `cancelled`
  - `approved`
  - `rejected`
- `PlotMediaKind`
  - `layout_source`
  - `layout_preview`
  - `survey`
  - `deed`
  - `allocation_letter`

### Core Rules
- A listing/plot has one current purchase status source of truth.
- Any status mutation writes a status history record.
- Expired holds automatically release listings/plots back to `available`.
- Backup choices do not lock inventory until promoted or explicitly held.
- Published customer-facing estate data should only read from published estate layout versions and published land listings.

## APIs

### Dashboard / Staff - Current
- `estates.list`
- `estates.get`
- `estates.create`
- `estates.update`
- `estates.delete`
- `estates.createLayout`
- `estates.listPlots`
- `estates.createPlot`
- `estates.updatePlot`
- `estates.deletePlot`

All current procedures derive company scope from the authenticated membership.
Estate and plot writes use company-qualified outcomes, and plot/layout creation
validates the parent estate against the active company.

### Dashboard / Staff - Planned
- `estates.assignListing`
- `estates.unassignListing`
- `estates.createManyPlots`
- `estates.updateManyPlots`
- `estates.publish`
- `estates.approvePlotReservation`
- `estates.rejectPlotReservation`
- `estates.releasePlotHold`
- `estates.listPurchaseRequests`
- `estates.updatePurchaseRequestStatus`

### Public / Customer
- `public.getEstateBySlug`
- `public.listEstateListings`
- `public.getListingDetails`
- `portal.saveListing`
- `portal.startListingHold`
- `portal.submitPurchaseRequest`
- `portal.withdrawPurchaseRequest`
- `portal.listCustomerPurchaseRequests`

### Contract Notes
- Plot coordinates should use normalized percentages where possible, not raw pixels only.
- Plot list endpoints should support both viewport-based and filter-based queries for map performance.
- Reservation writes must enforce tenant scoping and status preconditions.

## UI

### Dashboard Surfaces
- `/properties`
  - all home and land listings, filters, summary counts, CTA to create listing
- `/properties?type=residential`
  - home listings
- `/properties?type=land`
  - land listings
- `/estates`
  - estate launch list, filters, summary counts, CTA to create estate launch
- `/estates/new`
  - create estate launch form
- `/estates/[id]`
  - estate launch summary, presale offer, grouped land listings, layout versions, inventory health, quick actions
- `/estates/[id]/layout`
  - import and builder canvas
- `/estates/[id]/plots`
  - estate-scoped land listing/plot table, bulk actions, CSV import/export later
- `/purchase-pipeline`
  - shared processing queue and approval actions for normal listings and estate presales

### Tenant-Site Surfaces
- `/estate/[slug]`
  - estate overview, hero, stats, CTA into picker
- `/estate/[slug]/select`
  - interactive picker
- `/portal/purchases`
  - customer purchase request summary
- `/portal/purchases/[requestId]`
  - status timeline, selected plot, backups, next actions

### Layout Builder Structure
- left rail
  - layers
  - tools
  - layout versions
- center
  - interactive canvas
- right rail
  - selected plot metadata editor
- top bar
  - save draft
  - publish
  - bulk actions
  - import/export

## Reservation and Processing Model
- Customer clicks `Select plot`.
- System creates a short hold if the plot is still `available`.
- Hold is visible with countdown to avoid double-selling.
- Customer submits reservation details and backups.
- Reservation moves to `processing`.
- Staff approves or rejects.
- Approval updates plot to `reserved` or `sold` depending on business rule.
- Rejection or expiry releases plot.

## Permissions
- `owner` and `admin`
  - full estate CRUD, layout publish, override status, approve reservations
- `agent`
  - create estates and plots if allowed by policy, review reservations, but no destructive override by default
- `staff`
  - view inventory and update operational metadata if granted
- `customer`
  - view published estates only, manage own reservations only

## Edge Cases
- Two customers try to hold the same plot at nearly the same time.
- A staff member changes plot status while a customer is mid-checkout.
- Layout version changes after plots are already reserved.
- A company wants to temporarily block a plot for internal reasons.
- A plot is unavailable publicly but must still appear to staff in search results.
- The uploaded PDF is rotated, skewed, low-resolution, or contains handwritten annotations.
- One customer wants a ranked list of fallback plots.
- A company wants to split an estate into phases but keep a unified public experience.

## Analytics and Success Metrics
- Time from first estate visit to plot selection.
- Plot self-service selection rate.
- Reservation submission rate.
- Hold expiry rate.
- Support touches per plot allocation.
- Approval turnaround time.
- Conversion by plot size and price band.

## MVP Recommendation
- Build estate CRUD, plot inventory, layout import, manual hotspot mapping, public plot picker, and reservation queue first.
- Do not wait for OCR or AI detection before launch.
- Validate operational behavior with 2 to 3 real estate-plan files before investing in assisted import.

## Future Improvements
- Assisted OCR for plot numbers and street labels.
- Grid/row detection for repeated rectangular layouts.
- Waitlists for unavailable plots.
- Payment-plan aware reservation progression.
- Automated allocation-letter generation.
- GIS-style map overlays for roads, landmarks, and open spaces.
- Side-by-side compare mode for shortlisted plots.
