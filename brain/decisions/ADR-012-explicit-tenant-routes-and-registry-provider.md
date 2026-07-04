# ADR-012: Explicit Tenant Routes And Registry Provider

## Status
Accepted

## Context
Tenant public pages previously used a catch-all `apps/tenant-site/src/app/[...slug]/page.tsx` route that reconstructed the incoming path, resolved it against the active template manifest, and rendered a section stack through `resolvePage()`. That kept route handling compact, but it made public page ownership implicit and pushed too much responsibility into one dynamic route.

The template direction now requires explicit App Router pages such as `/about`, `/blog`, `/blog/[slug]`, `/projects`, and `/contact`, with a registry provider normalizing tenant/template/runtime context for template-owned pages and sections.

## Decision
Tenant public template pages use explicit App Router route files. Shared rendering behavior lives in `apps/tenant-site/src/lib/tenant-page.tsx`, and route-to-page-key mapping lives in `apps/tenant-site/src/lib/tenant-route-map.ts`.

The section registry now exposes `RegistryProvider` and `useRegistry()`. The tenant root layout initializes registry context with:

- tenant identity
- selected template key
- deserialized template config
- render mode
- route/page capability info

The register catalog now exposes plan-owned collections through `registerTemplatesByPlan` and `getRegisterTemplatesForPlan()`. Register templates are resolved by concrete template key, not by shared family key.

The section registry also exposes the first concrete contract layer for template-owned pages and primitives:

- `templatePages` / `templates` resolve handles such as `templates.aboutPage.resolve(ctx)` into `{ Page, info }`, where `info` carries manifest-backed support state, route slug, canonical path, page disabled state, and supported plans.
- `createRegistryQueryOptions()` and `createRegistryMutationOptions()` inject tenant/template/page/runtime scope into query and mutation keys. Queries switch between dev mock resolvers and live resolvers from the same endpoint contract; mutations are blocked outside live mode unless a dev resolver is explicitly supplied.
- `templateButtonVariants()`, `templateInputVariants()`, `templateSurfaceVariants()`, and `createTemplateUiResolver()` provide template style-preset primitives for future template-local `ui/*` components.
- The first active plan-owned register template is `starter/riwaq` (`riwaq-starter`), with landing, blog, contact, and roadmap pages.

## Consequences
Explicit routes make public page ownership visible in the filesystem and remove catch-all coupling from the tenant site. The shared renderer preserves existing metadata, blog post lookup, listing overview filtering, unsupported-page handling, and no-published-site fallbacks without duplicating that logic in every route.

The registry provider gives future template-owned page components and section primitives a stable `useRegistry()` context. The current implementation still renders migrated pages through the compatibility `resolvePage()` section-stack bridge; future work can replace individual template pages with concrete page components without changing public route files.

The new page facade deliberately does not move tenant database reads into `packages/section-registry`. Tenant-site continues to own server data resolution, while template folders can incrementally register concrete page components and share the same page metadata, scoped query options, and style-preset UI primitives.
