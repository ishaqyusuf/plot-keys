# API Contracts

## Purpose
This file tracks request and response shape conventions.

## How To Use
- Update when public or internal API contract patterns become concrete.
- Keep examples short and schema-oriented.

## Initial Contract Rules
- Validate input and output at service boundaries.
- Preserve tenant scoping in all contracts.
- Prefer explicit enums for status-driven workflows.
- Use structured payloads for website sections and AI outputs.
- Current API scaffold can derive request auth context from headers before full Better Auth session wiring lands.
- Auth mutations now return structured session handoff payloads instead of redirect responses:
  - `redirectTo`
  - auth-flow-specific metadata such as onboarding defaults for sign-up
  - `sessionToken` only when the auth step is complete enough to persist a dashboard session immediately
- `auth.signUp` now returns verification-first metadata rather than an active session:
  - `email`
  - `onboarding`
  - `redirectTo`
  - `verificationToken`
- Store API-facing Zod schemas in `apps/api/src/schemas/*` rather than shared utility packages so transport contracts stay API-owned and discoverable.
- Workspace/dashboard mutations now use API-owned schemas in `apps/api/src/schemas/workspace.schema.ts` for:
  - onboarding completion
  - template draft creation
  - site-field updates
  - publish requests
  - smart-fill requests
- Current workspace mutation responses stay intentionally small and redirect-friendly:
  - `configId` for builder mutations that should route the dashboard back to a specific configuration
  - `syncedCount` for tenant-domain sync operations
- Billing checkout contracts now allow the dashboard to pass the active host callback URL into `workspace.initializeCheckout` so provider redirects return to the correct local, preview, or production dashboard origin.
- Team invite contracts now support an optional `workRole` alongside the required access `role` so employee invites can carry standardized workplace persona.

## Planned Enums
- `LeadStatus`: `NEW`, `CONTACTED`, `NEGOTIATING`, `CLOSED`
- `ClientStage`: `NEW_LEAD`, `INTERESTED`, `NEGOTIATING`, `CLOSED`
- `PaymentMethod`: `PAYSTACK`, `FLUTTERWAVE`, `STRIPE`, `BANK_TRANSFER`, `CASH`
- `MembershipRole`: `PLATFORM_ADMIN`, `OWNER`, `ADMIN`, `AGENT`, `STAFF`
- `WorkRole`: `OPERATIONS`, `SALES_AGENT`, `SALES_MANAGER`, `HR`, `FINANCE`, `MARKETING`, `PROJECT_MANAGER`, `EXECUTIVE`

## Structured Builder Contract Example
```json
{
  "page": "home",
  "sections": [
    {
      "type": "hero_banner",
      "config": {
        "title": "Luxury Apartments",
        "subtitle": "Find your dream home",
        "backgroundImage": "hero.jpg"
      }
    }
  ]
}
```

## AI Output Contract Rules
- JSON only for structured website generation flows
- Validate against section schema before persistence
- Reject unrecognized section types
