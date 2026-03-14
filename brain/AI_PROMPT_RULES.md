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
