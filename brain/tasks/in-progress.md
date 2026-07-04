# In Progress

## Purpose
This file tracks work currently being executed.

## How To Use
- Keep this list short and current.
- Move completed work to `done.md`.

## In Progress

### Dashboard UI + Structure Migration
- Priority: High
- Description: Migrate dashboard pages one at a time to the approved Midday-inspired structure, using `/Users/M1PRO/Documents/code/_kitchen_sink/midday/apps/dashboard/src/app/[locale]/(app)/(sidebar)/invoices/page.tsx` and its table modules as the current page reference.
- Related Feature: Dashboard Feature Plan; Design System
- Status: In Progress
- Current Page: Customers (`apps/dashboard/src/app/(app)/customers/page.tsx`)
- Migration Notes:
  - Keep route files thin and compositional.
  - Split page-level header, summaries, table, columns, empty states, and loading states into feature-owned modules.
  - Customers now use the GND sales-book table/search/filter pattern: shared `@plotkeys/ui/data-table`, `@plotkeys/ui/search-filter`, generated filter-list query, URL filter hook, and tRPC infinite query backed by `composeQueryData`.
  - Reuse the new list-query helper for upcoming dashboard migrations before adding page-specific pagination logic.
  - Update `brain/progress.md` after each page migration.
- Created Date: 2026-05-22

### Apply Pending Prisma Migrations
- Priority: High
- Description: Run Prisma generate and apply the pending migrations for modular dashboard apps and customer offers so completed code paths are backed by the local/database schema.
- Related Feature: Modular Dashboard Sidebar; Customer Portal Phase 1C
- Status: In Progress
- Created Date: 2026-05-21
