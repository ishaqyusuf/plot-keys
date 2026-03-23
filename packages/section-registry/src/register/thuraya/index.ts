/**
 * Thuraya (Luxury) template family — index.
 * Family key: "luxury" | Arabic name: Thuraya (ثريا = Pleiades / Precious)
 * Business type: luxury_firm
 *
 * Exports the family metadata, all three plan variants, and a convenience
 * array for registration loops.
 */

import type { TemplateFamilyMeta, TemplatePlanVariant } from "../types";

import { thurayaContentSchema } from "./common/content-schema";
import { thurayaPlaceholderData } from "./common/placeholder-data";
import { thurayaNav } from "./common/nav";
import { thurayaFooter } from "./common/footer";

import { thurayaStarterPages } from "./starter/pages";
import { thurayaStarterTheme } from "./starter/theme";
import { thurayaStarterContent } from "./starter/content";

import { thurayaPlusPages } from "./plus/pages";
import { thurayaPlusTheme } from "./plus/theme";
import { thurayaPlusContent } from "./plus/content";

import { thurayaProPages } from "./pro/pages";
import { thurayaProTheme } from "./pro/theme";
import { thurayaProContent } from "./pro/content";

// Re-export shared assets so consumers can import from a single path.
export {
  thurayaContentSchema,
  thurayaPlaceholderData,
  thurayaNav,
  thurayaFooter,
};

// ---------------------------------------------------------------------------
// Family metadata
// ---------------------------------------------------------------------------

export const thurayaFamilyMeta: TemplateFamilyMeta = {
  key: "luxury",
  label: "Luxury Firm",
  businessType: "luxury_firm",
  arabicName: "Thuraya",
  arabicMeaning: "Pleiades / Precious",
  description:
    "High-end luxury real estate firms with editorial presentation and prestige portfolio.",
};

// ---------------------------------------------------------------------------
// Plan variants
// ---------------------------------------------------------------------------

export const thurayaStarter: TemplatePlanVariant = {
  key: "thuraya-starter",
  name: "Thuraya Starter",
  family: "luxury",
  tier: "starter",
  pages: thurayaStarterPages,
  defaultContent: thurayaStarterContent,
  ...thurayaStarterTheme,
};

export const thurayaPlus: TemplatePlanVariant = {
  key: "thuraya-plus",
  name: "Thuraya Plus",
  family: "luxury",
  tier: "plus",
  pages: thurayaPlusPages,
  defaultContent: thurayaPlusContent,
  ...thurayaPlusTheme,
};

export const thurayaPro: TemplatePlanVariant = {
  key: "thuraya-pro",
  name: "Thuraya Pro",
  family: "luxury",
  tier: "pro",
  pages: thurayaProPages,
  defaultContent: thurayaProContent,
  ...thurayaProTheme,
};

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus → pro
// ---------------------------------------------------------------------------

export const thurayaVariants: TemplatePlanVariant[] = [
  thurayaStarter,
  thurayaPlus,
  thurayaPro,
];
