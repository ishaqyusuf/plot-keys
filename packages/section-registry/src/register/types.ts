/**
 * Shared types for the plan-based template register.
 *
 * All 6 template families (Noor, Bana, Wafi, Faris, Thuraya, Sakan)
 * import from here. This file has no React dependency and is safe for
 * use in both server and client contexts.
 */

import type { TenantResource } from "../types";
import type { TemplateTier } from "../index";

// ---------------------------------------------------------------------------
// Family metadata
// ---------------------------------------------------------------------------

export type TemplateFamilyKey =
  | "agency"
  | "developer"
  | "manager"
  | "solo"
  | "luxury"
  | "rental";

export type TemplateFamilyMeta = {
  /** Arabic family name used in template keys and folder names. */
  arabicName: string;
  /** Arabic word meaning — used in marketplace descriptions. */
  arabicMeaning: string;
  /** The businessType value this family targets from onboarding. */
  businessType: string;
  /** Short description shown in the marketplace family header. */
  description: string;
  key: TemplateFamilyKey;
  /** Human-readable family label shown in the marketplace. */
  label: string;
};

// ---------------------------------------------------------------------------
// Content schema
// ---------------------------------------------------------------------------

/**
 * Definition of a single editable text field.
 * Used in common/content-schema.ts per family.
 *
 * - contentKey: dot-notation key stored in TenantContentRecord
 * - defaultValue: seeded for real new-tenant drafts
 * - placeholderValue: shown in "template" browse mode only, never stored
 * - aiEnabled: whether the AI generate action is available for this field
 */
export type ContentFieldDef = {
  aiEnabled: boolean;
  contentKey: string;
  defaultValue: string;
  label: string;
  placeholderValue: string;
};

// ---------------------------------------------------------------------------
// Placeholder data shapes (for "template" browse mode)
// ---------------------------------------------------------------------------

export type PlaceholderListing = {
  id: string;
  imageUrl?: string;
  location: string;
  price: string;
  slug: string;
  specs: string;
  title: string;
};

export type PlaceholderAgent = {
  bio: string;
  id: string;
  name: string;
  photoUrl?: string;
  role: string;
  slug: string;
};

export type PlaceholderProject = {
  id: string;
  imageUrl?: string;
  location: string;
  slug: string;
  status: string;
  title: string;
};

export type PlaceholderTestimonial = {
  author: string;
  id: string;
  quote: string;
  role: string;
};

export type PlaceholderService = {
  description: string;
  id: string;
  title: string;
};

export type PlaceholderData = {
  agents?: PlaceholderAgent[];
  listings?: PlaceholderListing[];
  projects?: PlaceholderProject[];
  services?: PlaceholderService[];
  testimonials?: PlaceholderTestimonial[];
};

// ---------------------------------------------------------------------------
// Nav + footer schemas
// ---------------------------------------------------------------------------

export type NavLink = {
  /** Whether this link only appears when the user is authenticated. */
  authRequired?: boolean;
  href: string;
  label: string;
  /** Plan tier required to include this link. Absent = all plans. */
  minTier?: TemplateTier;
};

export type NavConfig = {
  /** Links shown in the primary navigation bar. */
  primary: NavLink[];
  /** Links shown in the mobile Sheet drawer (may differ from primary). */
  mobile: NavLink[];
  /** Label for the primary CTA button in the nav (e.g. "Book a Call"). */
  ctaLabel: string;
  /** Href for the nav CTA button. */
  ctaHref: string;
};

export type FooterLinkGroup = {
  heading: string;
  links: { href: string; label: string }[];
};

export type FooterConfig = {
  groups: FooterLinkGroup[];
  /** Tagline shown below the logo in the footer. */
  tagline: string;
};

// ---------------------------------------------------------------------------
// Plan variant definition
// ---------------------------------------------------------------------------

/**
 * A single plan-tier variant of a template family.
 * Produced by each family's starter/index.ts, plus/index.ts, pro/index.ts.
 */
export type TemplatePlanVariant = {
  /** Default content seeds — used for real new-tenant drafts. */
  defaultContent: Record<string, string>;
  /** Default accent color hex. */
  defaultAccentColor: string;
  /** Default background color hex. */
  defaultBackgroundColor: string;
  /** Default color system key (e.g. "slate", "ocean", "forest"). */
  defaultColorSystem: string;
  /** Default body font family. */
  defaultFontFamily: string;
  /** Default heading font family. */
  defaultHeadingFontFamily: string;
  /** Default style preset key. */
  defaultStylePreset: string;
  family: TemplateFamilyKey;
  /** Unique template key, e.g. "noor-starter". */
  key: string;
  /** Human-readable name shown in the marketplace. */
  name: string;
  /** Full page inventory for this variant. */
  pages: RegisterPageDefinition[];
  tier: TemplateTier;
};

// ---------------------------------------------------------------------------
// Page + section types (register-specific, extends page-inventory.ts)
// ---------------------------------------------------------------------------

export type RegisterSectionSlot = {
  contentKeys: string[];
  dataSource?: TenantResource;
  defaultEnabled: boolean;
  id: string;
  label: string;
  requiredResources?: TenantResource[];
  sectionType: string;
  sortOrder: number;
};

export type RegisterPageDefinition = {
  label: string;
  pageKey: string;
  sections: RegisterSectionSlot[];
  slug: string;
  /** Plan tier required to include this page. Absent = all plans show it. */
  minTier?: TemplateTier;
};
