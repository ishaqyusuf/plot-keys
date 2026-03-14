# Project Brain

## Purpose
This Brain is the working memory for the real-estate SaaS. It records the current product direction, implementation constraints, and decisions so future code stays aligned.

## How To Use
- Read this file first before planning or coding.
- Treat linked Brain docs as the source of truth for current intent.
- Update affected Brain files whenever implementation changes product scope, APIs, schema, architecture, or tasks.

## Current State
- Repository is at project initialization stage.
- Product scope is defined at a high level.
- Business logic should be added progressively as features are implemented.
- Design system and monorepo structure must be based on the approved `midday` reference project.
- Frontend stack should use the latest practical versions of Next.js and Tailwind CSS at implementation time.

## Key References
- [System Overview](/Users/M1PRO/Documents/code/real-estate-saas/brain/SYSTEM_OVERVIEW.md)
- [Project Index](/Users/M1PRO/Documents/code/real-estate-saas/brain/PROJECT_INDEX.md)
- [AI Workflow](/Users/M1PRO/Documents/code/real-estate-saas/brain/AI_WORKFLOW.md)
- [AI Prompt Rules](/Users/M1PRO/Documents/code/real-estate-saas/brain/AI_PROMPT_RULES.md)
- [Product Vision](/Users/M1PRO/Documents/code/real-estate-saas/brain/product/vision.md)
- [Repo Structure](/Users/M1PRO/Documents/code/real-estate-saas/brain/engineering/repo-structure.md)

## Working Rules
- Prefer documenting only what is known today.
- Use `TODO:` for unclear details instead of inventing architecture.
- Keep implementation modular for multi-tenant growth.
- Centralize cross-cutting concerns such as AI billing and domain management behind services.
