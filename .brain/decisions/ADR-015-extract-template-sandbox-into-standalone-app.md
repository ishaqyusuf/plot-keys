# ADR-015: Extract Template Sandbox into a Standalone App

## Status

Accepted on 2026-07-28.

## Context

Template sandbox authoring lived inside `apps/dashboard`, while share previews
and database/render helpers lived inside `apps/tenant-site`. This blurred
deployment ownership, exposed the sandbox namespace through the full dashboard
API router, and made a non-production testing surface depend on two production
apps.

The Sandbox must remain safe to share internally: profiles are common to
platform administrators, preview links are stable and public, and no action may
create production tenant, domain, or website records.

## Decision

- Create independently deployable `apps/sandbox` as the sole owner of sandbox
  profile management, platform-admin authentication, workbench routes, and
  public share previews.
- Keep the existing shared `template_sandbox_profiles` table and
  `template-sandbox-public` owner. No schema migration is introduced.
- Protect every authoring procedure and protected page with platform-admin
  authorization. Keep one public read-only preview query.
- Mount a focused same-origin `SandboxAppRouter` containing only sign-in and
  sandbox procedures.
- Extract reusable Builder/Sandbox presentation and normalization into
  `packages/website-builder`; keep routing and mutation adapters in each app.
- Resolve preview pages only from the template inventory, including declared
  dynamic routes.
- Keep dashboard and tenant-site legacy URLs as query/path-preserving
  redirects to the canonical Sandbox app.
- Use `sandbox.plotkeys.com`, direct local port `3909`, and Portless
  `https://sandbox-plotkeys.localhost` as canonical hosts.

## Consequences

### Positive

- Sandbox deployment, auth, failures, caching, and testing are isolated from
  tenant production rendering.
- Public previews expose a narrow read-only API surface.
- Dashboard Builder and Sandbox can evolve against one reusable presentation
  runtime without cross-app imports.
- Existing profiles and share IDs remain valid through redirect compatibility.

### Tradeoffs

- A fifth web app must be deployed and included in local environment tooling.
- Shared runtime changes require focused validation in both dashboard Builder
  and Sandbox.
- Server-rendered Sandbox pages depend on the app's same-origin tRPC endpoint
  and shared database availability.

## Rejected Alternatives

- Keep authoring in dashboard and previewing in tenant-site: preserves the
  ownership ambiguity and couples testing to production apps.
- Create isolated tenant/database records for tests: violates the requirement
  that sandbox profiles never produce production-shaped records.
- Put routing/auth adapters in the shared package: would turn a reusable
  presentation package into a cross-app orchestration layer.

## References

- `.brain/features/template-sandbox.md`
- `.brain/modules/template-config-mode.md`
- `.brain/system/architecture.md`
