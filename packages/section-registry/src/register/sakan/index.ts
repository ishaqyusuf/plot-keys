/**
 * Sakan (Rental) template family — index.
 * Family key: "rental" | Arabic name: Sakan (سكن = Dwelling / Residence)
 * Business type: rental_business
 *
 * Exports the family metadata, all three plan variants, and a convenience
 * array for registration loops.
 */

import type { TemplateFamilyMeta, TemplatePlanVariant } from "../types";

import { sakanContentSchema } from "./common/content-schema";
import { sakanPlaceholderData } from "./common/placeholder-data";
import { sakanNav } from "./common/nav";
import { sakanFooter } from "./common/footer";

import { sakanStarterPages } from "./starter/pages";
import { sakanStarterTheme } from "./starter/theme";
import { sakanStarterContent } from "./starter/content";

import { sakanPlusPages } from "./plus/pages";
import { sakanPlusTheme } from "./plus/theme";
import { sakanPlusContent } from "./plus/content";

import { sakanProPages } from "./pro/pages";
import { sakanProTheme } from "./pro/theme";
import { sakanProContent } from "./pro/content";

// Re-export shared assets so consumers can import from a single path.
export {
  sakanContentSchema,
  sakanPlaceholderData,
  sakanNav,
  sakanFooter,
};

// ---------------------------------------------------------------------------
// Family metadata
// ---------------------------------------------------------------------------

export const sakanFamilyMeta: TemplateFamilyMeta = {
  key: "rental",
  label: "Rental Business",
  businessType: "rental_business",
  arabicName: "Sakan",
  arabicMeaning: "Dwelling / Residence",
  description:
    "Rental-first businesses focused on tenant acquisition and landlord services.",
};

// ---------------------------------------------------------------------------
// Plan variants
// ---------------------------------------------------------------------------

export const sakanStarter: TemplatePlanVariant = {
  key: "sakan-starter",
  name: "Sakan Starter",
  family: "rental",
  tier: "starter",
  pages: sakanStarterPages,
  defaultContent: sakanStarterContent,
  ...sakanStarterTheme,
};

export const sakanPlus: TemplatePlanVariant = {
  key: "sakan-plus",
  name: "Sakan Plus",
  family: "rental",
  tier: "plus",
  pages: sakanPlusPages,
  defaultContent: sakanPlusContent,
  ...sakanPlusTheme,
};

export const sakanPro: TemplatePlanVariant = {
  key: "sakan-pro",
  name: "Sakan Pro",
  family: "rental",
  tier: "pro",
  pages: sakanProPages,
  defaultContent: sakanProContent,
  ...sakanProTheme,
};

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus → pro
// ---------------------------------------------------------------------------

export const sakanVariants: TemplatePlanVariant[] = [
  sakanStarter,
  sakanPlus,
  sakanPro,
];
