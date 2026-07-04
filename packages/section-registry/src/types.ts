/**
 * Shared primitive types extracted to break circular import chains.
 *
 * Import from here rather than from index.ts when a type is needed inside
 * a module that index.ts also imports from.
 */

export type RenderMode = "live" | "draft" | "preview" | "template";

export type TemplateTier = "starter" | "plus" | "pro";

/**
 * Tenant resource keys used to declare which live DB resource feeds a
 * section slot. Sections that declare a dataSource render display-only
 * dynamic items — never editable inline in the builder.
 */
export type TenantResource =
  | "listings"
  | "agents"
  | "projects"
  | "testimonials"
  | "blog_posts"
  | "contact"
  | "services"
  | "area_guides";

export type EditableFieldDefinition = {
  aiEnabled?: boolean;
  contentKey: string;
  fieldType: "text" | "textarea";
  label: string;
  longDetail: string;
  placeholder?: string;
  preferredLength?: string;
  shortDetail: string;
};

export type TenantContentRecord = Record<string, string>;

export type TemplateThemeRecord = {
  accentColor: string;
  backgroundColor: string;
  colorSystem?: string;
  fontFamily: string;
  headingFontFamily: string;
  logo: string;
  logoUrl?: string;
  market: string;
  stylePreset?: string;
  supportLine: string;
};

export type TenantThemeRecord = Partial<TemplateThemeRecord>;

export type TemplateDefinition = {
  defaultContent: TenantContentRecord;
  defaultTheme: TemplateThemeRecord;
  description: string;
  editableFields: EditableFieldDefinition[];
  key: string;
  /** Human-readable marketing tagline shown in the template picker. */
  marketingTagline: string;
  name: string;
  /** Named image defaults exposed to the builder for URL replacement. */
  namedImageSlots?: Record<string, string>;
  /** Whether this template can be individually purchased without a plan upgrade. */
  purchasable: boolean;
  /** URL of the preview thumbnail used in template cards. */
  previewImageUrl?: string;
  /** Recommendation and marketplace tags derived from the canonical manifest. */
  tags?: string[];
  tier: TemplateTier;
};
