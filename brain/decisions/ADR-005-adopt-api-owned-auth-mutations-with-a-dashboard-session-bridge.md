# ADR-005: Adopt API-Owned Auth Mutations with a Dashboard Session Bridge

## Status
Accepted

## Context

PlotKeys originally implemented sign-up, sign-in, verify-email, and sign-out as Next.js server actions inside `apps/dashboard`. That kept the first tenant-entry flow moving, but it left the real auth business logic in the dashboard app instead of the intended `apps/api` boundary.

The repository architecture already points toward a Midday-style Hono + tRPC API layer. Moving auth mutations behind that API is the first concrete step toward making the dashboard a typed client of `apps/api`.

Cross-origin cookie handling is still a practical concern because the dashboard and API run as separate apps during development. A direct move to API-managed `Set-Cookie` responses would add extra coordination risk while the broader action migration is still in progress.

## Decision

PlotKeys will move auth business logic into `apps/api` tRPC procedures and keep cookie persistence in the dashboard app through a minimal session bridge route.

The chosen pattern is:

- `apps/api` owns auth validation and mutation results such as sign-up, sign-in, and verify-email
- auth procedures return structured results including `sessionToken` and `redirectTo`
- `apps/dashboard` persists the returned session token through a small same-origin `/api/session` route
- dashboard client forms then navigate using the returned redirect target

The dashboard now mounts the shared tRPC app router through its own same-origin `/api/trpc` route and uses a Midday-style `client.tsx` and `server.tsx` setup for tRPC usage. The session bridge remains temporary until auth cookie writing is folded fully into the same-origin auth runtime boundary.

This preserves a clean API ownership boundary for business logic without coupling the API rollout to a full auth runtime rewrite.

## Alternatives Considered

- Keep auth as dashboard-only server actions until the whole API migration is complete
- Have the API set browser cookies directly during cross-origin tRPC calls
- Pause the migration until Better Auth handlers and adapters fully replace the temporary Prisma-backed auth layer

## Consequences

Positive impact:
- moves auth business logic to the intended API boundary now
- establishes the provider, mutation, and session pattern the remaining dashboard actions can follow
- keeps the current signed session token format stable during the migration

Tradeoffs:
- introduces a temporary two-step auth completion flow: API mutation then dashboard cookie persistence
- Better Auth runtime adoption is still pending
- remaining protected dashboard mutations still need to migrate onto the same pattern
