/**
 * Shared types for the plan-owned template register.
 *
 * Templates live under their owning plan folder:
 * `register/starter/<template>`, `register/plus/<template>`,
 * `register/pro/<template>`. There is no shared family folder layer.
 */

import type { TenantResource, TemplateTier } from "../types";

// ---------------------------------------------------------------------------
// Content schema
// ---------------------------------------------------------------------------

export type ContentFieldDef = {
  aiEnabled: boolean;
  contentKey: string;
  defaultValue: string;
  label: string;
  placeholderValue: string;
};

// ---------------------------------------------------------------------------
// Placeholder data shapes
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
  description?: string;
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

export type PlaceholderBlogPost = {
  content: string;
  excerpt: string;
  featuredImageUrl?: string;
  id: string;
  publishedAt: string;
  slug: string;
  title: string;
};

export type PlaceholderData = {
  agents?: PlaceholderAgent[];
  blogPosts?: PlaceholderBlogPost[];
  listings?: PlaceholderListing[];
  projects?: PlaceholderProject[];
  services?: PlaceholderService[];
  testimonials?: PlaceholderTestimonial[];
};

// ---------------------------------------------------------------------------
// Nav + footer schemas
// ---------------------------------------------------------------------------

export type NavLink = {
  authRequired?: boolean;
  href: string;
  label: string;
  minTier?: TemplateTier;
};

export type NavConfig = {
  ctaHref: string;
  ctaLabel: string;
  mobile: NavLink[];
  primary: NavLink[];
};

export type FooterLinkGroup = {
  heading: string;
  links: { href: string; label: string }[];
};

export type FooterConfig = {
  groups: FooterLinkGroup[];
  tagline: string;
};

// ---------------------------------------------------------------------------
// Page + section types
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
};

// ---------------------------------------------------------------------------
// Plan-owned template definition
// ---------------------------------------------------------------------------

export type TemplatePlanVariant = {
  businessType?: string;
  defaultAccentColor: string;
  defaultBackgroundColor: string;
  defaultColorSystem: string;
  defaultContent: Record<string, string>;
  defaultFontFamily: string;
  defaultHeadingFontFamily: string;
  defaultStylePreset: string;
  description: string;
  editableFields: ContentFieldDef[];
  features: string[];
  footer: FooterConfig;
  key: string;
  marketingTagline: string;
  name: string;
  nav: NavConfig;
  pages: RegisterPageDefinition[];
  placeholderData: PlaceholderData;
  purchasable: boolean;
  supportedPlans: TemplateTier[];
  tags: string[];
  tier: TemplateTier;
};
