# Template Marketplace System

## Purpose
This file defines the multi-template marketplace model for free, plan-included, and purchase-based template access.

## Product Model
- Templates are reusable website blueprints composed from shared section definitions.
- Templates are products.
- Licenses grant template usage.
- Plan benefits create claimable licenses.
- Purchases create permanent licenses.
- Installed tenant websites are copies of template structure into a tenant draft, not edits of the master template.

## Core Concepts
- `Template`
- `TemplatePage`
- `TemplateSection`
- `TemplatePlanAccess`
- `TemplatePurchase`
- `TenantTemplateLicense`

## Access Rules
- Starter:
  - all starter-free templates are available
- Plus:
  - all starter-free templates are available
  - plus users can claim 3 included templates
  - other templates remain purchasable
- Pro:
  - all starter-free templates are available
  - pro users can claim 3 included templates
  - other templates remain purchasable

## License Rule
- Template access should always resolve through a license record.
- A tenant should receive a template license whether access came from:
  - free access
  - included plan claim
  - purchase
  - admin grant

## Pricing Models
- `FREE_FOR_ALL`
- `INCLUDED_BY_PLAN`
- `PAID_ONLY`

## License Sources
- `FREE`
- `PLAN_INCLUDED`
- `PURCHASED`
- `ADMIN_GRANTED`

## Template Metadata
- `title`
- `slug`
- `shortDescription`
- `fullDescription`
- `contentDescription`
- `previewImage`
- `previewGallery`
- `demoUrl`
- `tags`
- `stylePreset`
- `pricingModel`
- `price`
- `supportedPages`
- `supportedSections`

## Composition Model
- Templates are not hardcoded websites.
- Templates are composed from:
  - reusable sections
  - page definitions
  - default configs
  - default theme values
- A template contains:
  - page
  - ordered section instances
  - default config
  - visibility rules

## Reusable Sections
- Templates must reference shared section definitions from the section registry.
- A template section should only store:
  - section type
  - default config
  - default visibility
  - optional content description

## Claim Model
- Included templates should not be auto-granted in bulk.
- Plus and Pro should use claim limits so the user chooses which included templates to activate.
- Claiming a template creates a `TenantTemplateLicense`.

## Marketplace Browse UX
- The marketplace should clearly show:
  - free templates
  - included templates
  - paid templates
  - already licensed templates
  - claimable templates
  - optional upgrade suggestions

## Tenant Install Flow
1. create or update draft website version
2. copy template pages into draft
3. copy section instances into draft
4. copy default config
5. apply tenant theme baseline
6. allow tenant customization

## Rule
- Master templates must remain immutable after publishing.

## Content Description
- Templates should include content descriptions to guide:
  - tenant understanding
  - AI content generation
  - section copy generation

## Future Extensions
- template bundles
- seasonal templates
- template ratings and reviews
- template creator marketplace
- upsell recommendations based on plan
