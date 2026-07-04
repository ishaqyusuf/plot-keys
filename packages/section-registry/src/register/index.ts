/**
 * Plan-owned template register.
 *
 * Templates are owned directly by their plan folder. There is no shared
 * family folder layer; each concrete template owns its pages, nav, footer,
 * content schema, placeholder data, and optional section components.
 */

import type { TemplateTier } from "../types";
import { plusRegisterTemplates } from "./plus";
import { proRegisterTemplates } from "./pro";
import { starterRegisterTemplates } from "./starter";
import { RiwaqRoadmapTimelineSection } from "./starter/riwaq/sections/roadmap-timeline";
import type {
  ContentFieldDef,
  FooterConfig,
  NavConfig,
  PlaceholderData,
  TemplatePlanVariant,
} from "./types";
import type { SectionComponentOverrides } from "./ui-types";

export { riwaqStarterTemplate } from "./starter";

export type {
  ContentFieldDef,
  FooterConfig,
  FooterLinkGroup,
  NavConfig,
  NavLink,
  PlaceholderAgent,
  PlaceholderBlogPost,
  PlaceholderData,
  PlaceholderListing,
  PlaceholderProject,
  PlaceholderService,
  PlaceholderTestimonial,
  RegisterPageDefinition,
  RegisterSectionSlot,
  TemplatePlanVariant,
} from "./types";
export type { SectionComponentOverrides } from "./ui-types";

export const registerTemplatesByPlan: Record<
  TemplateTier,
  TemplatePlanVariant[]
> = {
  starter: starterRegisterTemplates,
  plus: plusRegisterTemplates,
  pro: proRegisterTemplates,
};

export const registerTemplateCatalog: TemplatePlanVariant[] = [
  ...registerTemplatesByPlan.starter,
  ...registerTemplatesByPlan.plus,
  ...registerTemplatesByPlan.pro,
];

export function getRegisterTemplate(
  key: string,
): TemplatePlanVariant | undefined {
  return registerTemplateCatalog.find((template) => template.key === key);
}

export function getRegisterTemplatesForPlan(
  tier: TemplateTier,
): TemplatePlanVariant[] {
  return registerTemplatesByPlan[tier] ?? [];
}

export function getAccessibleRegisterTemplates(
  tier: TemplateTier,
): TemplatePlanVariant[] {
  return getRegisterTemplatesForPlan(tier);
}

export function getRegisterTemplateForBusiness(
  businessType: string,
  tier: TemplateTier,
): TemplatePlanVariant | undefined {
  return (
    getRegisterTemplatesForPlan(tier).find(
      (template) => template.businessType === businessType,
    ) ?? getRegisterTemplatesForPlan(tier)[0]
  );
}

export function getRegisterContentSchema(templateKey: string): ContentFieldDef[] {
  return getRegisterTemplate(templateKey)?.editableFields ?? [];
}

export function getPlaceholderContent(
  templateKey: string,
): Record<string, string> {
  return Object.fromEntries(
    getRegisterContentSchema(templateKey).map((field) => [
      field.contentKey,
      field.placeholderValue,
    ]),
  );
}

export function getRegisterPlaceholderData(
  templateKey: string,
): PlaceholderData {
  return getRegisterTemplate(templateKey)?.placeholderData ?? {};
}

const tierOrder: Record<TemplateTier, number> = { starter: 0, plus: 1, pro: 2 };

function fallbackNav(): NavConfig {
  return {
    ctaHref: "/contact",
    ctaLabel: "Contact",
    mobile: [],
    primary: [],
  };
}

export function getRegisterNavConfig(
  templateKey: string,
  tier?: TemplateTier,
): NavConfig {
  const nav = getRegisterTemplate(templateKey)?.nav;
  if (!nav) return fallbackNav();

  if (!tier) return nav;

  const maxOrder = tierOrder[tier];
  const filterLinks = (links: NavConfig["primary"]) =>
    links.filter((link) => !link.minTier || tierOrder[link.minTier] <= maxOrder);

  return {
    ...nav,
    mobile: filterLinks(nav.mobile),
    primary: filterLinks(nav.primary),
  };
}

export function getRegisterFooterConfig(templateKey: string): FooterConfig {
  return (
    getRegisterTemplate(templateKey)?.footer ?? {
      groups: [],
      tagline: "",
    }
  );
}

const registerSectionComponentMap: Record<string, SectionComponentOverrides> = {
  "riwaq-starter": {
    riwaq_roadmap_timeline: RiwaqRoadmapTimelineSection as SectionComponentOverrides[string],
  },
};

export function resolveRegisterSectionComponents(
  templateKey: string | undefined,
): SectionComponentOverrides {
  if (!templateKey) return {};
  return registerSectionComponentMap[templateKey] ?? {};
}
