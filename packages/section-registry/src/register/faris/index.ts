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
import { farisFooterConfig } from "./common/footer";
import { farisNavConfig } from "./common/nav";
import { farisPlaceholderData } from "./common/placeholder-data";

// Re-export shared assets so consumers can import from a single path.
export {
  farisContentSchema,
  farisFooterConfig,
  farisNavConfig,
  farisPlaceholderData,
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

// ---------------------------------------------------------------------------
// Convenience array — ordered starter → plus
// ---------------------------------------------------------------------------

export const farisVariants: TemplatePlanVariant[] = [];
