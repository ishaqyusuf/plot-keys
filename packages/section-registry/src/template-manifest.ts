import type { PageDefinition, TemplatePageInventory } from "./page-inventory";
import { pageAliasFields } from "./register/inner-page-defaults";
import type {
  EditableFieldDefinition,
  TemplateDefinition,
  TemplateTier,
  TenantResource,
} from "./types";

export type TemplateRouteMatch = {
  page: PageDefinition;
  routeSlug: string | null;
};

export type TemplateManifest = TemplateDefinition & {
  dataRequirements: TenantResource[];
  features: string[];
  pages: PageDefinition[];
  supportedPlans: TemplateTier[];
  tags: string[];
  version: number;
};

const baseThemeKeys = new Set([
  "accentColor",
  "backgroundColor",
  "chartColor",
  "colorSystem",
  "fontFamily",
  "headingFontFamily",
  "iconLibrary",
  "logo",
  "logoUrl",
  "market",
  "menuAccent",
  "menuStyle",
  "radius",
  "stylePreset",
  "supportLine",
]);
const pageAliasContentKeys = new Set<string>(pageAliasFields);

function assertNonEmptyString(value: string, label: string) {
  if (!value.trim()) {
    throw new Error(`Template manifest ${label} must not be empty.`);
  }
}

function normalizePathname(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
}

function matchTemplateRoute(route: string, pathname: string) {
  const normalizedRoute = normalizePathname(route);
  const normalizedPathname = normalizePathname(pathname);

  if (normalizedRoute === normalizedPathname) return null;

  const routeSegments = normalizedRoute.split("/").filter(Boolean);
  const pathSegments = normalizedPathname.split("/").filter(Boolean);

  if (routeSegments.length !== pathSegments.length) return undefined;

  let routeSlug: string | null = null;

  for (let index = 0; index < routeSegments.length; index += 1) {
    const routeSegment = routeSegments[index];
    const pathSegment = pathSegments[index];

    if (!routeSegment || !pathSegment) return undefined;

    if (routeSegment.startsWith("[") && routeSegment.endsWith("]")) {
      routeSlug = decodeURIComponent(pathSegment);
      continue;
    }

    if (routeSegment !== pathSegment) return undefined;
  }

  return routeSlug;
}

export function defineTemplateManifest(
  manifest: TemplateManifest,
): TemplateManifest {
  assertNonEmptyString(manifest.key, "key");
  assertNonEmptyString(manifest.name, "name");
  assertNonEmptyString(manifest.description, "description");

  if (!manifest.pages.length) {
    throw new Error(
      `Template "${manifest.key}" must declare at least one page.`,
    );
  }

  const editableContentKeys = new Set<string>();
  for (const field of manifest.editableFields) {
    assertNonEmptyString(
      field.contentKey,
      `editable field key for "${manifest.key}"`,
    );
    assertNonEmptyString(
      field.label,
      `editable field label for "${manifest.key}:${field.contentKey}"`,
    );
    assertNonEmptyString(
      field.shortDetail,
      `editable field short detail for "${manifest.key}:${field.contentKey}"`,
    );
    assertNonEmptyString(
      field.longDetail,
      `editable field long detail for "${manifest.key}:${field.contentKey}"`,
    );

    if (editableContentKeys.has(field.contentKey)) {
      throw new Error(
        `Template "${manifest.key}" has duplicate editable field "${field.contentKey}".`,
      );
    }
    editableContentKeys.add(field.contentKey);
  }

  const pageKeys = new Set<string>();
  const pageSlugs = new Set<string>();

  for (const page of manifest.pages) {
    assertNonEmptyString(page.pageKey, `page key for "${manifest.key}"`);
    assertNonEmptyString(page.slug, `page slug for "${manifest.key}"`);

    if (pageKeys.has(page.pageKey)) {
      throw new Error(
        `Template "${manifest.key}" has duplicate page key "${page.pageKey}".`,
      );
    }
    pageKeys.add(page.pageKey);

    if (pageSlugs.has(page.slug)) {
      throw new Error(
        `Template "${manifest.key}" has duplicate page slug "${page.slug}".`,
      );
    }
    pageSlugs.add(page.slug);

    const sectionIds = new Set<string>();
    for (const section of page.sections) {
      assertNonEmptyString(
        section.id,
        `section id for "${manifest.key}:${page.pageKey}"`,
      );
      assertNonEmptyString(
        section.label,
        `section label for "${manifest.key}:${page.pageKey}:${section.id}"`,
      );
      assertNonEmptyString(
        section.sectionType,
        `section type for "${manifest.key}:${page.pageKey}:${section.id}"`,
      );

      if (sectionIds.has(section.id)) {
        throw new Error(
          `Template "${manifest.key}" page "${page.pageKey}" has duplicate section "${section.id}".`,
        );
      }
      sectionIds.add(section.id);

      if (section.dataSource && section.contentKeys.length > 0) {
        throw new Error(
          `Template "${manifest.key}" section "${section.id}" uses data source "${section.dataSource}" and must not declare editable content keys.`,
        );
      }
    }
  }

  const home = manifest.pages.find((page) => page.pageKey === "home");
  if (!home || home.slug !== "/") {
    throw new Error(`Template "${manifest.key}" must declare home at "/".`);
  }

  if (!manifest.supportedPlans.includes(manifest.tier)) {
    throw new Error(
      `Template "${manifest.key}" must include its own tier in supportedPlans.`,
    );
  }

  return manifest;
}

export function createTemplateManifestRegistry(
  manifests: TemplateManifest[],
): Map<string, TemplateManifest> {
  const registry = new Map<string, TemplateManifest>();

  for (const manifest of manifests.map(defineTemplateManifest)) {
    if (registry.has(manifest.key)) {
      throw new Error(`Duplicate template key "${manifest.key}".`);
    }
    registry.set(manifest.key, manifest);
  }

  return registry;
}

export function getTemplateManifest(
  registry: Map<string, TemplateManifest>,
  templateKey: string,
): TemplateManifest {
  const manifest = registry.get(templateKey);
  if (!manifest) {
    throw new Error(`Unknown template "${templateKey}".`);
  }
  return manifest;
}

export function templateManifestToDefinition(
  manifest: TemplateManifest,
): TemplateDefinition {
  return {
    defaultContent: manifest.defaultContent,
    defaultTheme: manifest.defaultTheme,
    description: manifest.description,
    editableFields: manifest.editableFields,
    key: manifest.key,
    marketingTagline: manifest.marketingTagline,
    name: manifest.name,
    ...(manifest.namedImageSlots
      ? { namedImageSlots: manifest.namedImageSlots }
      : {}),
    purchasable: manifest.purchasable,
    ...(manifest.previewImageUrl
      ? { previewImageUrl: manifest.previewImageUrl }
      : {}),
    tags: manifest.tags,
    tier: manifest.tier,
  };
}

export function manifestToPageInventory(
  manifest: TemplateManifest,
): TemplatePageInventory {
  return {
    pages: manifest.pages,
    templateKey: manifest.key,
  };
}

function editableFieldMap(manifest: TemplateManifest) {
  return new Map(
    manifest.editableFields.map((field) => [field.contentKey, field]),
  );
}

function addEditableField(
  fields: Map<string, EditableFieldDefinition>,
  field: EditableFieldDefinition,
  contentKey: string,
  page?: PageDefinition,
) {
  if (fields.has(contentKey)) return;

  fields.set(
    contentKey,
    contentKey === field.contentKey
      ? field
      : {
          ...field,
          contentKey,
          label: page ? `${page.label} ${field.label}` : field.label,
        },
  );
}

function getEditableContentFieldsForPages(
  manifest: TemplateManifest,
  pages: PageDefinition[],
): Map<string, EditableFieldDefinition> {
  const declaredFields = editableFieldMap(manifest);
  const fields = new Map<string, EditableFieldDefinition>();

  for (const page of pages) {
    for (const section of page.sections) {
      for (const contentKey of section.contentKeys) {
        const declaredField = declaredFields.get(contentKey);
        if (declaredField) {
          addEditableField(fields, declaredField, contentKey);
        }

        if (page.pageKey === "home" || !pageAliasContentKeys.has(contentKey)) {
          continue;
        }

        const aliasedField = declaredFields.get(contentKey);
        if (!aliasedField) continue;

        addEditableField(
          fields,
          aliasedField,
          `${page.pageKey}.${contentKey}`,
          page,
        );
      }
    }
  }

  return fields;
}

export function getTemplateEditableContentFields(
  manifest: TemplateManifest,
): Map<string, EditableFieldDefinition> {
  return getEditableContentFieldsForPages(manifest, manifest.pages);
}

export function getTemplateEditableFieldsForPage(
  manifest: TemplateManifest,
  pageKey: string,
): EditableFieldDefinition[] {
  const page = manifest.pages.find((item) => item.pageKey === pageKey);
  if (!page) return [];

  return [...getEditableContentFieldsForPages(manifest, [page]).values()];
}

export function getTemplateEditableContentField(
  manifest: TemplateManifest,
  contentKey: string,
): EditableFieldDefinition | undefined {
  return getTemplateEditableContentFields(manifest).get(contentKey);
}

export function getTemplateAiContentField(
  manifest: TemplateManifest,
  contentKey: string,
): EditableFieldDefinition | undefined {
  const field = getTemplateEditableContentField(manifest, contentKey);
  return field?.aiEnabled ? field : undefined;
}

export function getTemplateAllowedContentKeys(
  manifest: TemplateManifest,
): Set<string> {
  return new Set(getTemplateEditableContentFields(manifest).keys());
}

export function isTemplateContentKeyAllowed(
  manifest: TemplateManifest,
  contentKey: string,
): boolean {
  return Boolean(getTemplateEditableContentField(manifest, contentKey));
}

export function normalizeTemplateContentFieldUpdate(
  manifest: TemplateManifest,
  currentContent: Record<string, string>,
  contentKey: string,
  value: string,
): Record<string, string> {
  if (!isTemplateContentKeyAllowed(manifest, contentKey)) {
    throw new Error(
      `Template "${manifest.key}" does not allow content key "${contentKey}".`,
    );
  }

  return {
    ...currentContent,
    [contentKey]: value.slice(0, 8000),
  };
}

export function isTemplateThemeKeyAllowed(
  manifest: TemplateManifest,
  themeKey: string,
): boolean {
  if (baseThemeKeys.has(themeKey)) return true;

  if (themeKey.startsWith("namedImage.")) {
    const slot = themeKey.replace("namedImage.", "");
    return Boolean(slot && manifest.namedImageSlots?.[slot]);
  }

  if (themeKey.startsWith("sectionVisible.")) {
    return themeKey.length > "sectionVisible.".length;
  }

  if (themeKey.startsWith("seo.")) {
    const [, pageKey, field] = themeKey.split(".");
    return (
      Boolean(pageKey) &&
      Boolean(field) &&
      ["title", "description", "ogImage"].includes(field ?? "") &&
      manifest.pages.some((page) => page.pageKey === pageKey)
    );
  }

  return false;
}

export function normalizeTemplateThemeFieldUpdate(
  manifest: TemplateManifest,
  currentTheme: Record<string, string>,
  themeKey: string,
  value: string,
): Record<string, string> {
  if (!isTemplateThemeKeyAllowed(manifest, themeKey)) {
    throw new Error(
      `Template "${manifest.key}" does not allow theme key "${themeKey}".`,
    );
  }

  return {
    ...currentTheme,
    [themeKey]: value.slice(0, 8000),
  };
}

export function resolveTemplateManifestRoute(
  manifest: TemplateManifest,
  pathname: string,
): TemplateRouteMatch | null {
  for (const page of manifest.pages) {
    const routeSlug = matchTemplateRoute(page.slug, pathname);
    if (routeSlug !== undefined) return { page, routeSlug };
  }

  return null;
}
