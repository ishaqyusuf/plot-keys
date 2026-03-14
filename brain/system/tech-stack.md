# Tech Stack

## Purpose
This file tracks chosen and proposed technologies for the project.

## How To Use
- Mark technologies as `Chosen`, `Planned`, or `TODO`.
- Update only when a decision becomes concrete.

## Workspace and Tooling
- Package manager: `Chosen` -> Bun-style workspace model based on reference project direction
- Monorepo orchestrator: `Chosen` -> Turbo
- Language: `Chosen` -> TypeScript
- Formatter/Linter: `Chosen` -> Biome, following reference project conventions

## Frontend
- React: `Chosen` -> modern React aligned with current Next.js support
- Next.js: `Chosen` -> 16.x line in the initial scaffold
- Tailwind CSS: `Chosen` -> 4.1.x line in the initial scaffold
- Shared UI package: `Chosen` -> Midday-style `packages/ui` approach

## Backend
- API framework: `Chosen` -> Hono + tRPC, following the Midday-style split
- RPC vs REST split: `Chosen` -> tRPC for typed app procedures with Hono-based API structure
- Background jobs: `Chosen` -> Trigger.dev
- Auth: `Chosen` -> Better Auth
- Database ORM/query layer: `TODO`

## Integrations
- Payments: `Planned` -> Paystack, Flutterwave, Stripe
- Domains: `Planned` -> one primary registrar/provider first
- SSL: `Planned` -> automatic certificate issuance and renewal
- Hosting: `Chosen` -> Vercel
- AI provider stack: `TODO`

## Notes
- The stack should stay current rather than frozen to the exact versions in the reference project.
- Structure and design-system philosophy come from `midday`; implementation versions are refreshed in the scaffold.
