/**
 * Shared primitive types extracted to break circular import chains.
 *
 * Import from here rather than from index.ts when a type is needed inside
 * a module that index.ts also imports from.
 */

export type RenderMode = "live" | "draft" | "preview" | "template";

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
