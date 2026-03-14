# ADR-003: Make Prisma the Schema Owner and Keep Drizzle as a Specialist Query Layer

## Status
Accepted

## Context

PlotKeys originally established `packages/db` around Drizzle schema definitions and Drizzle-managed migrations. That foundation worked for SQL-first ownership, but the desired team workflow has now changed.

The repository needs:
- Prisma to own the canonical relational schema and migration history
- Prisma Client available as the default application ORM
- Drizzle retained for places where lower-level SQL composition and typed table access are more useful
- a package structure that makes the split explicit so the monorepo can use both tools intentionally

## Decision

`packages/db/prisma` is now the canonical schema and migration boundary for the repository.

Prisma owns:
- `schema.prisma`
- generated Prisma Client
- migration history under `packages/db/prisma/migrations`

Drizzle remains in `packages/db/drizzle`, but only as a mirrored query/runtime layer. It must not become a second migration authority.

Application code should import both clients through `@plotkeys/db`, with this default guidance:
- use Prisma first for standard reads, writes, relations, and team-wide CRUD workflows
- use Drizzle when SQL-shaped queries, explicit selections, or lower-level control are materially better

## Alternatives Considered

- Keep Drizzle as the schema owner and add Prisma only as an optional consumer client
- Standardize on Prisma only and remove Drizzle entirely
- Standardize on Drizzle only and avoid dual-ORM maintenance

## Consequences

Positive impact:
- aligns the repository with Prisma-first schema ownership and migration workflow
- gives the team Prisma Client and Prisma Studio as the default developer experience
- preserves Drizzle for targeted workloads where its SQL-first model is a better fit

Tradeoffs:
- schema definitions now need a mirrored Drizzle table layer for specialist query usage
- dual-ORM discipline is required to prevent schema drift and casual duplication
- reviews for table changes should verify both Prisma ownership and Drizzle mirror alignment
