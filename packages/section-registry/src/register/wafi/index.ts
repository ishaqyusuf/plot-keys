/**
 * Wafi (Manager) template family — index.
 * Family key: "manager" | Arabic name: Wafi (وافي = Loyal / Trustworthy)
 * Business type: property_manager
 *
 * Exports the family metadata, all three plan variants, and a convenience
 * array for registration loops.
 */

import type { TemplateFamilyMeta, TemplatePlanVariant } from "../types";

import { wafiContentSchema } from "./common/content-schema";
import { wafiPlaceholderData } from "./common/placeholder-data";
import { wafiNavConfig } from "./common/nav";
import { wafiFooterConfig } from "./common/footer";

import { wafiStarterPages } from "./starter/pages";
import { wafiStarterTheme } from "./starter/theme";
import { wafiStarterContent } from "./starter/content";

import { wafiPlusPages } from "./plus/pages";
import { wafiPlusTheme } from "./plus/theme";
import { wafiPlusContent } from "./plus/content";

import { wafiProPages } from "./pro/pages";
import { wafiProTheme } from "./pro/theme";
import { wafiProContent } from "./pro/content";

// Re-export shared assets so consumers can import from a single path.
export {
  wafiContentSchema,
  wafiPlaceholderData,
  wafiNavConfig,
  wafiFooterConfig,
};

// ---------------------------------------------------------------------------
// Family metadata
// ---------------------------------------------------------------------------

export const wafiFamilyMeta: TemplateFamilyMeta = {
  key: "manager",
  label: "Property Manager",
  businessType: "property_manager",
  arabicName: "Wafi",
  arabicMeaning: "Loyal / Trustworthy",
  description:
    "Property management companies offering landlord services and tenant-facing portals.",
};

// ---------------------------------------------------------------------------
// Plan variants
// ---------------------------------------------------------------------------

export const wafiStarter: TemplatePlanVariant = {
  key: "wafi-starter",
  name: "Wafi Starter",
  family: "manager",
  tier: "starter",
  pages: wafiStarterPages,
  defaultContent: wafiStarterContent,
  ...wafiStarterTheme,
};

export const wafiPlus: TemplatePlanVariant = {
  key: "wafi-plus",
  name: "Wafi Plus",
  family: "manager",
  tier: "plus",
  pages: wafiPlusPages,
  defaultContent: wafiPlusContent,
  ...wafiPlusTheme,
};

export const wafiPro: TemplatePlanVariant = {
  key: "wafi-pro",
  name: "Wafi Pro",
  family: "manager",
  tier: "pro",
  pages: wafiProPages,
  defaultContent: wafiProContent,
  ...wafiProTheme,
};

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus → pro
// ---------------------------------------------------------------------------

export const wafiVariants: TemplatePlanVariant[] = [
  wafiStarter,
  wafiPlus,
  wafiPro,
];
