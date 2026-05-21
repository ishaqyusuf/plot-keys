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
import { sakanFooter } from "./common/footer";
import { sakanNav } from "./common/nav";
import { sakanPlaceholderData } from "./common/placeholder-data";

// Re-export shared assets so consumers can import from a single path.
export { sakanContentSchema, sakanFooter, sakanNav, sakanPlaceholderData };

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

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus
// ---------------------------------------------------------------------------

export const sakanVariants: TemplatePlanVariant[] = [];
