# Template Install Flow

## Purpose
This workflow defines how a licensed or claimable template becomes a tenant draft website.

## Flow
1. tenant selects a template
2. system checks:
  - already licensed
  - claimable by plan
  - requires purchase
3. if claimable:
  - create `TenantTemplateLicense`
4. if purchase is required:
  - create purchase intent
  - create billing line item
  - on payment success create `TenantTemplateLicense`
5. install into draft website:
  - create or update draft website version
  - copy template pages
  - copy template section instances
  - copy default config
  - apply theme baseline
  - apply tenant template config defaults
6. open recommended preview or draft editor

## Rules
- Never edit the master template directly.
- Template installation should be repeatable for draft regeneration flows.
- Template installation should remain compatible with onboarding-driven draft creation.
