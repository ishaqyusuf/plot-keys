import type { PageDefinition, TemplatePageInventory } from "./page-inventory";
import type {
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
    throw new Error(`Template "${manifest.key}" must declare at least one page.`);
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

export function getTemplateAllowedContentKeys(
  manifest: TemplateManifest,
): Set<string> {
  const keys = new Set<string>();

  for (const field of manifest.editableFields) {
    keys.add(field.contentKey);
  }

  for (const page of manifest.pages) {
    for (const section of page.sections) {
      for (const key of section.contentKeys) {
        keys.add(key);
      }
    }

    if (page.pageKey !== "home") {
      for (const field of manifest.editableFields) {
        keys.add(`${page.pageKey}.${field.contentKey}`);
      }
    }
  }

  return keys;
}

export function isTemplateContentKeyAllowed(
  manifest: TemplateManifest,
  contentKey: string,
): boolean {
  return getTemplateAllowedContentKeys(manifest).has(contentKey);
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
