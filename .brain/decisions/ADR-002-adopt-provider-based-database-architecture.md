# ADR: Adopt Provider-Based Database Architecture

## Status

Accepted

## Context

The repository currently uses Drizzle with a Postgres runtime in `packages/db`, but several Brain documents still describe Supabase as the primary database platform. That wording makes the architecture look more vendor-coupled than the actual code needs to be.

PlotKeys needs:
- a stable application-owned database boundary that works with multiple infrastructure vendors
- room to run the same relational schema on local Docker Postgres, Supabase Postgres, or another managed Postgres host
- a clear separation between core data access and optional platform integrations such as storage or realtime

## Decision

PlotKeys will treat `packages/db` as the canonical database boundary for application code.

`packages/db` will expose provider-aware database client creation, schema ownership, and migration workflow. The current provider implementations are:
- `postgres`
- `supabase-postgres`

Both providers currently use the same Postgres + Drizzle runtime path. Supabase is therefore treated as an infrastructure option, not as the default application architecture.

`packages/supabase` remains optional and is reserved for Supabase-specific platform capabilities such as storage helpers, signed asset access, and optional realtime integrations.

## Alternatives

- Keep Supabase as the primary named database platform everywhere
- Introduce a new package per database vendor immediately
- Move to a fully ORM-abstracted multi-dialect layer before feature implementation requires it

## Consequences

Positive outcomes:
- reduces vendor lock-in in application code and architecture docs
- keeps the current Postgres + Drizzle workflow intact
- makes future database provider additions additive instead of invasive
- clarifies that Supabase services are optional integrations, not the core persistence boundary

Tradeoffs:
- true non-Postgres support still requires future adapter work
- provider metadata adds a small amount of indirection to the shared database package
- docs and package responsibilities must stay disciplined so Supabase logic does not leak back into core flows

## Implementation Notes

- `apps/*` and shared packages should depend on `@plotkeys/db` for relational data access.
- `DATABASE_PROVIDER` selects the active provider metadata; `postgres` is the default.
- `DATABASE_URL` remains the canonical connection string input for the shared database package.
- New non-Postgres providers should be introduced behind new adapters in `packages/db`, with a follow-up ADR if the query or migration model changes materially.
