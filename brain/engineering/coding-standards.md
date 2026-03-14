# Coding Standards

## Purpose
This file defines implementation guardrails for the repository.

## How To Use
- Read before coding.
- Update when conventions become explicit through implementation.

## General Rules
- Keep modules small and composable.
- Prefer shared packages over copy-paste across apps.
- Avoid introducing speculative abstractions too early.
- Use clear schema validation around external input and AI output.

## Frontend Rules
- Base design system and project structure on the approved `midday` reference project.
- Use the latest stable Next.js and Tailwind CSS versions at setup time.
- Prefer a shared `packages/ui` package over app-local component duplication.
- Keep section renderer components stateless and predictable.

## Multi-Tenant Rules
- Scope tenant data explicitly in every app and service boundary.
- Prevent tenant-specific content leakage across rendering or caching layers.
- Model custom domains and subdomains as tenant-level concerns.

## AI Rules
- Route all AI feature calls through a centralized service.
- Validate structured outputs before storing or rendering them.
- Track usage for billing and analytics.

## Documentation Rules
- Update Brain docs after meaningful implementation changes.
- Create ADRs for durable architectural choices.
