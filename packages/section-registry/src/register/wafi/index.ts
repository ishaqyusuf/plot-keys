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
import { wafiFooterConfig } from "./common/footer";
import { wafiNavConfig } from "./common/nav";
import { wafiPlaceholderData } from "./common/placeholder-data";

// Re-export shared assets so consumers can import from a single path.
export {
  wafiContentSchema,
  wafiFooterConfig,
  wafiNavConfig,
  wafiPlaceholderData,
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

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus
// ---------------------------------------------------------------------------

export const wafiVariants: TemplatePlanVariant[] = [];
