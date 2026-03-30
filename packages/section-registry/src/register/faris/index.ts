/**
 * Faris (Solo) template family — index.
 * Family key: "solo" | Arabic name: Faris (فارس = Knight)
 * Business type: independent_agent
 *
 * Exports the family metadata, all three plan variants, and a convenience
 * array for registration loops.
 */

import type { TemplateFamilyMeta, TemplatePlanVariant } from "../types";

import { farisContentSchema } from "./common/content-schema";
import { farisPlaceholderData } from "./common/placeholder-data";
import { farisNavConfig } from "./common/nav";
import { farisFooterConfig } from "./common/footer";

import { farisStarterPages } from "./starter/pages";
import { farisStarterTheme } from "./starter/theme";
import { farisStarterContent } from "./starter/content";

import { farisPlusPages } from "./plus/pages";
import { farisPlusTheme } from "./plus/theme";
import { farisPlusContent } from "./plus/content";

import { farisProPages } from "./pro/pages";
import { farisProTheme } from "./pro/theme";
import { farisProContent } from "./pro/content";

// Re-export shared assets so consumers can import from a single path.
export {
  farisContentSchema,
  farisPlaceholderData,
  farisNavConfig,
  farisFooterConfig,
};

// ---------------------------------------------------------------------------
// Family metadata
// ---------------------------------------------------------------------------

export const farisFamilyMeta: TemplateFamilyMeta = {
  key: "solo",
  label: "Independent Agent",
  businessType: "independent_agent",
  arabicName: "Faris",
  arabicMeaning: "Knight",
  description:
    "Independent agents and solo operators building a personal real estate brand.",
};

// ---------------------------------------------------------------------------
// Plan variants
// ---------------------------------------------------------------------------

export const farisStarter: TemplatePlanVariant = {
  key: "faris-starter",
  name: "Faris Starter",
  family: "solo",
  tier: "starter",
  pages: farisStarterPages,
  defaultContent: farisStarterContent,
  ...farisStarterTheme,
};

export const farisPlus: TemplatePlanVariant = {
  key: "faris-plus",
  name: "Faris Plus",
  family: "solo",
  tier: "plus",
  pages: farisPlusPages,
  defaultContent: farisPlusContent,
  ...farisPlusTheme,
};

export const farisPro: TemplatePlanVariant = {
  key: "faris-pro",
  name: "Faris Pro",
  family: "solo",
  tier: "pro",
  pages: farisProPages,
  defaultContent: farisProContent,
  ...farisProTheme,
};

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus → pro
// ---------------------------------------------------------------------------

export const farisVariants: TemplatePlanVariant[] = [
  farisStarter,
  farisPlus,
  farisPro,
];
