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
import { thurayaFooter } from "./common/footer";
import { thurayaNav } from "./common/nav";
import { thurayaPlaceholderData } from "./common/placeholder-data";

// Re-export shared assets so consumers can import from a single path.
export {
  thurayaContentSchema,
  thurayaFooter,
  thurayaNav,
  thurayaPlaceholderData,
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

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus
// ---------------------------------------------------------------------------

export const thurayaVariants: TemplatePlanVariant[] = [];
