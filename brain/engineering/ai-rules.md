# AI Rules

## Purpose
This file tracks repository-specific rules for implementing product AI features.

## How To Use
- Update when AI feature boundaries or billing rules become more concrete.
- Keep rules implementation-facing.

## Core Rules
- Every product AI call must go through a centralized service interface.
- AI outputs must be structured, validated, and safely mapped into downstream systems.
- AI usage must be billable or auditable per tenant.

## Website Content Generation Rules
- Generate content against known section types only.
- Return JSON compatible with section config schemas.
- Map generated content into section configs before rendering.

## Billing Rules
- Log usage fields at minimum: `companyId`, `userId`, `feature`, `tokensUsed`, `creditsUsed`, `timestamp`.
- Disable AI features when a tenant has no available credits, subject to final billing policy.
- Support monthly credits, purchased credits, and promotional credits.

## Future AI Features
- Recommendation engine
- Lead scoring
- Lead reply assistance
- Property pricing assistance
- FAQ generation
- Layout suggestions
