# Template Sandbox

## Status

Implemented as a standalone app on 2026-07-28.

## Purpose

Provide a dedicated, independently deployable environment where platform
administrators can create shared mock template profiles, configure template
presentation, and review stable draft/live links without creating or mutating
production tenant records.

## Ownership

- `apps/sandbox` owns profile management, platform-admin authentication,
  authoring routes, and public share previews.
- `packages/website-builder` owns reusable Builder/Sandbox preview
  presentation and pure sandbox normalization/path resolution.
- `apps/api` owns the focused `SandboxAppRouter` and profile persistence
  orchestration.
- `packages/db` continues to own the existing
  `template_sandbox_profiles` queries and table contract.
- Dashboard and tenant-site keep redirects only.

## Routes

- `/`: protected profile registry and creation form.
- `/profiles/[profileId]`: protected full-screen workbench with `page` and
  `path` query state.
- `/preview/[shareId]/[[...slug]]`: public read-only draft/live preview.
- `/sign-in`: platform-account sign in.
- `/api/session`: Sandbox-host session bridge.
- `/api/trpc/[trpc]`: focused same-origin tRPC endpoint.

## Invariants

- Authoring requires `platform_admin`.
- Share previews are public, read-only, and `noindex`.
- Profiles remain shared through the
  `template-sandbox-public` service owner.
- Archiving is soft deletion and immediately invalidates share previews.
- No sandbox operation creates tenants, domains, websites, versions, or
  production records.
- Template paths must be declared in the template inventory. Riwaq explicitly
  declares `/blog/[slug]` as a dynamic blog-post page.

## Environment

- Portless: `https://sandbox-plotkeys.localhost`
- Direct local: `http://localhost:3909`
- Hosted default: `https://sandbox.plotkeys.com`
- Environment keys: `SANDBOX_PORT`, `NEXT_PUBLIC_SANDBOX_URL`,
  `SANDBOX_PUBLIC_URL`, and `SANDBOX_ROOT_DOMAIN`.

## QA

Focused coverage verifies URL/sibling resolution, legacy redirect mapping,
draft/live normalization, static/dynamic path resolution, and anonymous,
non-admin, platform-admin, and public-preview API access.
