# Template Register Plan

## Purpose
Canonical specification for the current plan-owned template register.

## Current Decision
The register is plan-first and template-owned. Templates live directly under the plan folder that owns them:

```txt
packages/section-registry/src/register/
  starter/
    riwaq/
      manifest.ts
      content.ts
      nav.ts
      footer.ts
      placeholder-data.ts
      pages/
      sections/
      ui/
      hooks/
    index.ts
  plus/
    index.ts
  pro/
    index.ts
  index.ts
  types.ts
```

There is no shared family folder layer. The previous `noor`, `bana`, `wafi`, `faris`, `thuraya`, and `sakan` folders have been removed from the active register model.

## Active Register Templates

| Plan | Template Key | Name | Status |
|------|--------------|------|--------|
| Starter | `riwaq-starter` | Riwaq | Active |
| Plus | none | - | Empty until a Plus-owned template is added |
| Pro | none | - | Empty until a Pro-owned template is added |

## Riwaq Starter

`Riwaq` follows the project naming convention by using a MENA/architectural name. It is a focused starter real-estate template for trust, publishing, contact capture, and visible project-history storytelling.

Pages:
- Landing: `/`
- Blog: `/blog`
- Contact: `/contact`
- Roadmap: `/roadmap`
- Privacy: `/privacy`
- Terms: `/terms`

Template-owned folders:
- `pages/`: concrete page components for the template facade
- `sections/`: template-specific sections such as the roadmap timeline
- `ui/`: template-local primitives, including internal link/anchor helpers
- `hooks/`: template-local runtime hooks based on `useRegistry()`

## Register APIs

The register resolves by concrete `templateKey`, not by family key.

Current APIs:
- `registerTemplatesByPlan`
- `registerTemplateCatalog`
- `getRegisterTemplate(templateKey)`
- `getRegisterTemplatesForPlan(tier)`
- `getAccessibleRegisterTemplates(tier)`
- `getRegisterTemplateForBusiness(businessType, tier)`
- `getRegisterContentSchema(templateKey)`
- `getPlaceholderContent(templateKey)`
- `getRegisterPlaceholderData(templateKey)`
- `getRegisterNavConfig(templateKey, tier)`
- `getRegisterFooterConfig(templateKey)`
- `resolveRegisterSectionComponents(templateKey)`

Removed active model:
- `TemplateFamilyKey`
- `templateFamilyRegistry`
- `getFamilyNavConfig`
- `getFamilyFooterConfig`
- `getFamilyPlaceholderData`
- `resolveFamilySectionComponents`

## Routing

Tenant-site public routes remain explicit App Router files. `apps/tenant-site/src/lib/tenant-route-map.ts` maps public paths to stable page keys.

Riwaq route support:
- `/` -> `home`
- `/blog` -> `blog`
- `/contact` and `/contact-us` -> `contact`
- `/roadmap` -> `roadmap`
- `/privacy` -> `privacy`
- `/terms` -> `terms`

Unsupported explicit routes still resolve through the page-support check and return not-found behavior where appropriate.

## Link Handling

Tenant-site shell components use `next/link` because they run inside the Next app.

Registry-owned template files should not import `next/link`; `packages/section-registry` does not own a Next dependency. Template-owned registry UI should expose route-aware anchor helpers or route descriptors, and the tenant-site layer can adapt those to `next/link` where needed.

## Data And Mode Contract

Template sections and pages consume runtime state through `RegistryProvider` / `useRegistry()`.

Data hooks should use the registry-scoped query/mutation helpers:
- live mode calls live resolvers
- non-live modes call dev/mock resolvers
- mutations are blocked outside live mode unless explicitly mocked

## Definition Of Done For New Templates

Every new template must:
- live under exactly one plan folder
- own its own name and key
- define its own page inventory
- define its own content schema
- define its own nav/footer config
- define its own placeholder data
- expose any template-specific sections through `resolveRegisterSectionComponents(templateKey)`
- avoid importing from another template folder
