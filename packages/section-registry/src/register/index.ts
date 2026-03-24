/**
 * Plan-based template register — master index.
 *
 * Exports all 18 template variants (6 families × 3 plan tiers), the
 * family registry grouped by genre, and lookup / resolver helpers.
 *
 * Standards enforced by this register:
 * 1. EDITABLE BOUNDARY — only contentKeys fields get EditableText wrappers.
 *    dataSource item fields are always display-only in the builder.
 * 2. UI SYSTEM — section components use raw Tailwind + var(--pk-*) CSS vars.
 *    Builder overlays use @plotkeys/ui (shadcn). Never mix.
 * 3. MOBILE RESPONSIVE — all templates meet the 320px–1440px breakpoint
 *    contract. Responsiveness is a baseline, not a plan tier feature.
 */

import type { TemplateFamilyKey, TemplateFamilyMeta, TemplatePlanVariant } from "./types";
import type { SectionComponentOverrides } from "./ui-types";
import type { TemplateTier } from "../index";

// ---------------------------------------------------------------------------
// Family imports
// ---------------------------------------------------------------------------

export { noorFamilyMeta, noorStarter, noorPlus, noorPro, noorVariants } from "./noor/index";
export { banaFamilyMeta, banaStarter, banaPlus, banaPro, banaVariants } from "./bana/index";
export { wafiFamilyMeta, wafiStarter, wafiPlus, wafiPro, wafiVariants } from "./wafi/index";
export { farisFamilyMeta, farisStarter, farisPlus, farisPro, farisVariants } from "./faris/index";
export { thurayaFamilyMeta, thurayaStarter, thurayaPlus, thurayaPro, thurayaVariants } from "./thuraya/index";
export { sakanFamilyMeta, sakanStarter, sakanPlus, sakanPro, sakanVariants } from "./sakan/index";

// Re-export types for consumers
export type { TemplateFamilyKey, TemplateFamilyMeta, TemplatePlanVariant } from "./types";
export type { ContentFieldDef, PlaceholderData, NavConfig, FooterConfig, RegisterPageDefinition, RegisterSectionSlot } from "./types";
export type { SectionComponentOverrides } from "./ui-types";

// ---------------------------------------------------------------------------
// Internal imports for registry construction
// ---------------------------------------------------------------------------

import { noorFamilyMeta, noorVariants } from "./noor/index";
import { banaFamilyMeta, banaVariants } from "./bana/index";
import { wafiFamilyMeta, wafiVariants } from "./wafi/index";
import { farisFamilyMeta, farisVariants } from "./faris/index";
import { thurayaFamilyMeta, thurayaVariants } from "./thuraya/index";
import { sakanFamilyMeta, sakanVariants } from "./sakan/index";

// UI component override maps — one per family
import { noorSectionComponents } from "./noor/ui/index";
import { banaSectionComponents } from "./bana/ui/index";
import { wafiSectionComponents } from "./wafi/ui/index";
import { farisSectionComponents } from "./faris/ui/index";
import { thurayaSectionComponents } from "./thuraya/ui/index";
import { sakanSectionComponents } from "./sakan/ui/index";

// ---------------------------------------------------------------------------
// Family registry — grouped by genre/family key
// ---------------------------------------------------------------------------

/**
 * All template families keyed by family key.
 * Use this for marketplace grouping, onboarding recommendation, and plan gating.
 *
 * @example
 * // Get all templates for a specific businessType
 * const family = Object.values(templateFamilyRegistry)
 *   .find(f => f.meta.businessType === onboarding.businessType);
 *
 * // Filter by accessible plan tier
 * const accessible = family?.variants.filter(v => accessibleTiers.has(v.tier));
 */
export const templateFamilyRegistry: Record<
  TemplateFamilyKey,
  { meta: TemplateFamilyMeta; variants: TemplatePlanVariant[] }
> = {
  agency:    { meta: noorFamilyMeta,    variants: noorVariants },
  developer: { meta: banaFamilyMeta,    variants: banaVariants },
  manager:   { meta: wafiFamilyMeta,    variants: wafiVariants },
  solo:      { meta: farisFamilyMeta,   variants: farisVariants },
  luxury:    { meta: thurayaFamilyMeta, variants: thurayaVariants },
  rental:    { meta: sakanFamilyMeta,   variants: sakanVariants },
};

// ---------------------------------------------------------------------------
// Flat catalog — all 18 variants in a single array
// ---------------------------------------------------------------------------

/**
 * Flat array of all 18 register template variants.
 * Ordered: agency → developer → manager → solo → luxury → rental,
 * and within each family: starter → plus → pro.
 */
export const registerTemplateCatalog: TemplatePlanVariant[] = Object.values(
  templateFamilyRegistry,
).flatMap((f) => f.variants);

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

/**
 * Returns a template variant by its unique key (e.g. "noor-starter").
 * Returns undefined when the key is not found.
 */
export function getRegisterTemplate(key: string): TemplatePlanVariant | undefined {
  return registerTemplateCatalog.find((t) => t.key === key);
}

/**
 * Returns all variants for a given family key.
 */
export function getRegisterFamily(
  familyKey: TemplateFamilyKey,
): TemplatePlanVariant[] {
  return templateFamilyRegistry[familyKey]?.variants ?? [];
}

/**
 * Returns the best-matching register template for a given businessType and plan tier.
 * Falls back to the starter tier when the requested tier has no match.
 */
export function getRegisterTemplateForBusiness(
  businessType: string,
  tier: TemplateTier,
): TemplatePlanVariant | undefined {
  const family = Object.values(templateFamilyRegistry).find(
    (f) => f.meta.businessType === businessType,
  );
  if (!family) return undefined;
  return (
    family.variants.find((v) => v.tier === tier) ??
    family.variants.find((v) => v.tier === "starter")
  );
}

/**
 * Returns all register templates accessible on a given plan tier.
 * Each tier can access its own templates plus all lower tiers.
 */
export function getAccessibleRegisterTemplates(
  tier: TemplateTier,
): TemplatePlanVariant[] {
  const tierOrder: Record<TemplateTier, number> = { starter: 0, plus: 1, pro: 2 };
  const maxOrder = tierOrder[tier];
  return registerTemplateCatalog.filter(
    (t) => tierOrder[t.tier] <= maxOrder,
  );
}

/**
 * Returns the family metadata for a given businessType, or undefined
 * when no family maps to that businessType.
 */
export function getFamilyMetaForBusinessType(
  businessType: string,
): TemplateFamilyMeta | undefined {
  return Object.values(templateFamilyRegistry).find(
    (f) => f.meta.businessType === businessType,
  )?.meta;
}

// ---------------------------------------------------------------------------
// Family UI component resolution
// ---------------------------------------------------------------------------

const familySectionComponentMap: Record<TemplateFamilyKey, SectionComponentOverrides> = {
  agency:    noorSectionComponents,
  developer: banaSectionComponents,
  manager:   wafiSectionComponents,
  solo:      farisSectionComponents,
  luxury:    thurayaSectionComponents,
  rental:    sakanSectionComponents,
};

/**
 * Returns the section component override map for a given template family.
 * Each entry in the map replaces the generic sectionComponent for that
 * section type with a family-branded design.
 *
 * Returns an empty map when family is undefined (no overrides applied,
 * generic components are used as-is — safe fallback for old template keys).
 *
 * @example
 * const overrides = resolveFamilySectionComponents("agency");
 * const Component = overrides["hero_banner"] ?? sectionComponents["hero_banner"];
 */
export function resolveFamilySectionComponents(
  family: TemplateFamilyKey | undefined,
): SectionComponentOverrides {
  if (!family) return {};
  return familySectionComponentMap[family] ?? {};
}
