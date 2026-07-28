# ADR-014: Adopt the Shared Local Infrastructure Toolkit

## Status

Accepted on 2026-07-28.

## Context

Plot Keys had repository-local environment loading, database startup, port cleanup, and dev routing scripts. School Clerk already moved the same concerns into `/Users/M1PRO/Documents/code/local-infra-kit`, where the behavior is shared and profile-aware.

Keeping local copies caused the projects to drift in environment file names, production mode values, Docker ports, filtered startup behavior, and database command safety.

## Decision

Plot Keys will use `local-infra-kit` with the `plotkeys` profile.

- Root `dev`, `dev:services`, `kill:ports`, build, database, and env-wrapped commands invoke the shared toolkit.
- Runnable workspaces use the shared `with-env.ts` wrapper and make their default `dev` command Portless-aware.
- Environment files follow `.env.local`, `.env.remote.local`, and `.env.prod`.
- All profiles expose the database as `DATABASE_URL`.
- The managed local Postgres service uses host port `55432`.
- Local database commands are the safe default. Remote and production database commands use explicit suffixes.
- Project-local copies of the shared env loader, port cleanup script, and dev router are removed.

## Consequences

### Positive

- Plot Keys and School Clerk share one development contract.
- Filtered startup clears only ports owned by the selected workspaces.
- Remote development does not unnecessarily start local Postgres.
- Production database access is explicit at the command boundary.
- Future fixes to the shared toolkit apply consistently across projects.

### Tradeoffs

- The sibling `local-infra-kit` checkout is required for local development.
- Toolkit mode names and file conventions are now part of the repository contract.
- Contributors must add reusable infrastructure behavior to the toolkit rather than patching a Plot Keys-only copy.

## References

- `/Users/M1PRO/Documents/code/local-infra-kit/README.md`
- `/Users/M1PRO/Documents/code/school-clerk/.brain/decisions/ADR-0008-cmux-portless-dev-and-prisma-profile-propagation.md`
- `.brain/features/local-infrastructure.md`
