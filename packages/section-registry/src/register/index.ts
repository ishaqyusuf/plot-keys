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

import type { TemplateTier } from "../index";
import { banaContentSchema } from "./bana/common/content-schema";
import { banaFooterConfig } from "./bana/common/footer";
import { banaNavConfig } from "./bana/common/nav";
import { banaPlaceholderData } from "./bana/common/placeholder-data";
import { farisContentSchema } from "./faris/common/content-schema";
import { farisFooterConfig } from "./faris/common/footer";
import { farisNavConfig } from "./faris/common/nav";
import { farisPlaceholderData } from "./faris/common/placeholder-data";
// Content schemas — one per family
import { noorContentSchema } from "./noor/common/content-schema";
// Footer configs — one per family
import { noorFooterConfig } from "./noor/common/footer";
// Nav configs — one per family
import { noorNavConfig } from "./noor/common/nav";
// Placeholder data — one per family
import { noorPlaceholderData } from "./noor/common/placeholder-data";
import { sakanContentSchema } from "./sakan/common/content-schema";
import { sakanFooter } from "./sakan/common/footer";
import { sakanNav } from "./sakan/common/nav";
import { sakanPlaceholderData } from "./sakan/common/placeholder-data";
import { thurayaContentSchema } from "./thuraya/common/content-schema";
import { thurayaFooter } from "./thuraya/common/footer";
import { thurayaNav } from "./thuraya/common/nav";
import { thurayaPlaceholderData } from "./thuraya/common/placeholder-data";
import type {
  ContentFieldDef,
  FooterConfig,
  NavConfig,
  PlaceholderData,
  TemplateFamilyKey,
  TemplateFamilyMeta,
  TemplatePlanVariant,
} from "./types";
import type { SectionComponentOverrides } from "./ui-types";
import { wafiContentSchema } from "./wafi/common/content-schema";
import { wafiFooterConfig } from "./wafi/common/footer";
import { wafiNavConfig } from "./wafi/common/nav";
import { wafiPlaceholderData } from "./wafi/common/placeholder-data";

// ---------------------------------------------------------------------------
// Family imports
// ---------------------------------------------------------------------------

export {
  banaFamilyMeta,
  banaPlus,
  banaPro,
  banaStarter,
  banaVariants,
} from "./bana/index";
export {
  farisFamilyMeta,
  farisPlus,
  farisPro,
  farisStarter,
  farisVariants,
} from "./faris/index";
export {
  noorFamilyMeta,
  noorPlus,
  noorPro,
  noorStarter,
  noorVariants,
} from "./noor/index";
export {
  sakanFamilyMeta,
  sakanPlus,
  sakanPro,
  sakanStarter,
  sakanVariants,
} from "./sakan/index";
export {
  thurayaFamilyMeta,
  thurayaPlus,
  thurayaPro,
  thurayaStarter,
  thurayaVariants,
} from "./thuraya/index";
// Re-export types for consumers
export type {
  ContentFieldDef,
  FooterConfig,
  FooterLinkGroup,
  NavConfig,
  NavLink,
  PlaceholderData,
  RegisterPageDefinition,
  RegisterSectionSlot,
  TemplateFamilyKey,
  TemplateFamilyMeta,
  TemplatePlanVariant,
} from "./types";
export type { SectionComponentOverrides } from "./ui-types";
export {
  wafiFamilyMeta,
  wafiPlus,
  wafiPro,
  wafiStarter,
  wafiVariants,
} from "./wafi/index";

// ---------------------------------------------------------------------------
// Internal imports for registry construction
// ---------------------------------------------------------------------------

import { banaFamilyMeta, banaVariants } from "./bana/index";
import { banaSectionComponents } from "./bana/ui/index";
import { farisFamilyMeta, farisVariants } from "./faris/index";
import { farisSectionComponents } from "./faris/ui/index";
import { noorFamilyMeta, noorVariants } from "./noor/index";
// UI component override maps — one per family
import { noorSectionComponents } from "./noor/ui/index";
import { sakanFamilyMeta, sakanVariants } from "./sakan/index";
import { sakanSectionComponents } from "./sakan/ui/index";
import { thurayaFamilyMeta, thurayaVariants } from "./thuraya/index";
import { thurayaSectionComponents } from "./thuraya/ui/index";
import { wafiFamilyMeta, wafiVariants } from "./wafi/index";
import { wafiSectionComponents } from "./wafi/ui/index";

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
  agency: { meta: noorFamilyMeta, variants: noorVariants },
  developer: { meta: banaFamilyMeta, variants: banaVariants },
  manager: { meta: wafiFamilyMeta, variants: wafiVariants },
  solo: { meta: farisFamilyMeta, variants: farisVariants },
  luxury: { meta: thurayaFamilyMeta, variants: thurayaVariants },
  rental: { meta: sakanFamilyMeta, variants: sakanVariants },
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
export function getRegisterTemplate(
  key: string,
): TemplatePlanVariant | undefined {
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
  const tierOrder: Record<TemplateTier, number> = {
    starter: 0,
    plus: 1,
    pro: 2,
  };
  const maxOrder = tierOrder[tier];
  return registerTemplateCatalog.filter((t) => tierOrder[t.tier] <= maxOrder);
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
// Placeholder content + data resolution (used for "template" render mode)
// ---------------------------------------------------------------------------

const familyContentSchemas: Record<TemplateFamilyKey, ContentFieldDef[]> = {
  agency: noorContentSchema,
  developer: banaContentSchema,
  manager: wafiContentSchema,
  solo: farisContentSchema,
  luxury: thurayaContentSchema,
  rental: sakanContentSchema,
};

const familyPlaceholderDataMap: Record<TemplateFamilyKey, PlaceholderData> = {
  agency: noorPlaceholderData,
  developer: banaPlaceholderData,
  manager: wafiPlaceholderData,
  solo: farisPlaceholderData,
  luxury: thurayaPlaceholderData,
  rental: sakanPlaceholderData,
};

/**
 * Returns a flat content record keyed by contentKey, using each field's
 * `placeholderValue`. Used in "template" render mode so the browse
 * experience shows realistic-looking copy without touching tenant data.
 */
export function getPlaceholderContent(
  familyKey: TemplateFamilyKey,
): Record<string, string> {
  const schema = familyContentSchemas[familyKey] ?? [];
  return Object.fromEntries(
    schema.map((f) => [f.contentKey, f.placeholderValue]),
  );
}

/**
 * Returns the placeholder data (listings, agents, projects, etc.) for a
 * family. Used in "template" render mode instead of live DB records.
 */
export function getFamilyPlaceholderData(
  familyKey: TemplateFamilyKey,
): PlaceholderData {
  return familyPlaceholderDataMap[familyKey] ?? {};
}

// ---------------------------------------------------------------------------
// Nav + footer config resolution
// ---------------------------------------------------------------------------

const familyNavConfigMap: Record<TemplateFamilyKey, NavConfig> = {
  agency: noorNavConfig,
  developer: banaNavConfig,
  manager: wafiNavConfig,
  solo: farisNavConfig,
  luxury: thurayaNav,
  rental: sakanNav,
};

const familyFooterConfigMap: Record<TemplateFamilyKey, FooterConfig> = {
  agency: noorFooterConfig,
  developer: banaFooterConfig,
  manager: wafiFooterConfig,
  solo: farisFooterConfig,
  luxury: thurayaFooter,
  rental: sakanFooter,
};

const tierOrder: Record<TemplateTier, number> = { starter: 0, plus: 1, pro: 2 };

/**
 * Returns the nav configuration for a family, filtered to the links that
 * are accessible on the given plan tier. Links with `minTier` above the
 * current tier are excluded from both primary and mobile menus.
 */
export function getFamilyNavConfig(
  familyKey: TemplateFamilyKey,
  tier: TemplateTier,
): NavConfig {
  const config = familyNavConfigMap[familyKey];
  if (!config)
    return {
      primary: [],
      mobile: [],
      ctaLabel: "Contact",
      ctaHref: "/contact",
    };
  const maxOrder = tierOrder[tier];
  const filterLinks = (links: NavConfig["primary"]) =>
    links.filter((l) => !l.minTier || tierOrder[l.minTier] <= maxOrder);
  return {
    ...config,
    primary: filterLinks(config.primary),
    mobile: filterLinks(config.mobile),
  };
}

/**
 * Returns the footer configuration for a family.
 */
export function getFamilyFooterConfig(
  familyKey: TemplateFamilyKey,
): FooterConfig {
  return familyFooterConfigMap[familyKey] ?? { groups: [], tagline: "" };
}

// ---------------------------------------------------------------------------
// Family UI component resolution
// ---------------------------------------------------------------------------

const familySectionComponentMap: Record<
  TemplateFamilyKey,
  SectionComponentOverrides
> = {
  agency: noorSectionComponents,
  developer: banaSectionComponents,
  manager: wafiSectionComponents,
  solo: farisSectionComponents,
  luxury: thurayaSectionComponents,
  rental: sakanSectionComponents,
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
