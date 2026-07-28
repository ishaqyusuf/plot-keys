# Public Website Launch

## Purpose
Track the public PlotKeys website positioning and launch gating rules.

## Product Positioning
- PlotKeys does not offer a freeform website builder today.
- The accurate public promise is template-led website launch: customers choose curated real-estate templates, edit the copy, and publish.
- Preferred short line: "Choose a template. Launch your site."

## Public Site Modes
- The website app uses a server-only `EARLY_ACCESS` flag.
- Set `EARLY_ACCESS=true` to show the early access page at `/`.
- Set `EARLY_ACCESS=false` to show the full landing page at `/`.
- Legacy `PLOTKEYS_PUBLIC_SITE_MODE` values of `early-access` and `landing` remain supported as a fallback when `EARLY_ACCESS` is not set.
- Production defaults to `early-access` when the setting is missing.
- Development defaults to `landing` and exposes preview routes for both experiences.

## Routes
- `/` renders the public mode selected by `EARLY_ACCESS`.
- `/landing` previews the full landing page in development.
- `/early-access` previews the early access page in development.
- Preview routes should not be publicly available in production unless that decision changes intentionally.

## Tenant Site Public Routes
- Tenant public pages now use explicit App Router files instead of a public `[...slug]` catch-all route.
- Shared tenant page rendering lives in `apps/tenant-site/src/lib/tenant-page.tsx`.
- Route-to-template-page mapping lives in `apps/tenant-site/src/lib/tenant-route-map.ts`.
- Supported explicit tenant routes include core pages, listing-style pages, blog/insight pages, template plan pages, roadmap/history pages, and utility/legal placeholders.
- The tenant root layout initializes registry runtime context through `RegistryProvider`, so future template pages and sections can call `useRegistry()` for tenant/template/mode/page info.
- `packages/section-registry` now exposes `templates.<page>.resolve(ctx)` for template-owned page handles, registry-scoped query/mutation helpers for tenant-safe data calls, and style-preset UI variant helpers for future template-local primitives.
- The active starter register template is `riwaq-starter`, with `/`, `/blog`, `/contact`, and `/roadmap` as its primary public surfaces.
