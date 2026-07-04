# AI Prompt Rules

## Purpose
This file defines prompt and output rules for AI agents working on the project and for product AI features.

## How To Use
- Update when prompting conventions or validation requirements change.
- Keep product-side rules separate from implementation details where possible.

## Repository Agent Rules
- Prefer Brain docs over assumptions.
- Use `TODO:` instead of guessing unknown technical details.
- Keep architecture incremental.
- Preserve multi-tenant safety and predictable rendering.

## Non-Negotiable Architecture Rules
- Midday is the primary standard for pages, tables, modals, sheets, sidebar, forms, onboarding, layouts, tRPC calls, loading states, error states, and caching patterns.
- Pages, tables, modals, sheets, forms, onboarding, sidebar, sign-out, and shared dashboard components must follow Midday architecture, file naming, and coding patterns.
- Data fetching and mutations must use standard Midday tRPC patterns, including invalidation, loading states, errors, and caching behavior.
- Forms must follow Midday validation, error handling, and mutation patterns.
- Use shadcn standard components and patterns. Never directly modify shadcn source components; create wrapper components for project-specific behavior.
- Use GND as the reference for the standard notification package system.
- Use After Service as the reference for local URL handling, portless/proxy support, root env mode loading, and generated app links.
- Tenant-site public pages must use explicit App Router page routes; do not add a public `[...slug]` catch-all unless an ADR documents a narrow exception.

## Product AI Rules
- All product AI outputs must be structured and validated.
- AI website content must map cleanly into section schemas.
- AI property descriptions and SEO outputs should be stored separately from raw prompts where useful.
- Every product AI call must go through a centralized AI service.

## Central AI Service Rules
- Use a single entry point such as `aiService.generate()`.
- Log `companyId`, `userId`, `feature`, `tokensUsed`, `creditsUsed`, and `timestamp`.
- Deduct credits before or at successful completion according to finalized billing rules.
- Keep auditability and retry behavior explicit.

## Output Safety Rules
- Prefer JSON outputs for website-builder-compatible content.
- Validate outputs against section or feature schemas before persistence.
- Reject or repair invalid payloads before rendering.

<!-- personal-coding-rules:start -->
## Global Personal Coding Rules

Agents must treat these global coding rule references as non-negotiable:

- `/Users/M1PRO/.me/coding-standards/global.md`
- `/Users/M1PRO/.me/coding-standards/nextjs.md`

Project-specific exceptions require an ADR in `brain/decisions/` before agents may diverge.
<!-- personal-coding-rules:end -->
