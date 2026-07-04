import {
  getTemplatePageInventoryStrict,
  type RegistryPageInfo,
} from "@plotkeys/section-registry";

export type TenantRouteMatch = {
  pageKey: string;
  routeSlug: string | null;
};

const staticTenantPageKeys: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/agents": "agents",
  "/areas": "areas",
  "/blog": "blog",
  "/blogs": "blog",
  "/careers": "careers",
  "/contact": "contact",
  "/contact-us": "contact",
  "/events": "events",
  "/faq": "faq",
  "/gallery": "gallery",
  "/how-it-works": "how-it-works",
  "/inquire": "inquire",
  "/insights": "insights",
  "/investors": "investors",
  "/landlords": "landlords",
  "/listings": "listings",
  "/our-project": "projects",
  "/portfolio": "portfolio",
  "/press": "press",
  "/private-sales": "private-sales",
  "/privacy": "privacy",
  "/projects": "projects",
  "/properties": "properties",
  "/rentals": "rentals",
  "/resources": "resources",
  "/roadmap": "roadmap",
  "/services": "services",
  "/tenant-resources": "tenant-resources",
  "/tenants": "tenants",
  "/terms": "terms",
  "/testimonials": "testimonials",
};

const dynamicTenantPageKeys = [
  { pageKey: "blog-post", prefix: "/blog/" },
  { pageKey: "blog-post", prefix: "/blogs/" },
  { pageKey: "blog-post", prefix: "/insights/" },
  { pageKey: "listing-detail", prefix: "/listings/" },
  { pageKey: "portfolio-detail", prefix: "/portfolio/" },
  { pageKey: "project-detail", prefix: "/projects/" },
  { pageKey: "property-detail", prefix: "/properties/" },
  { pageKey: "rental-detail", prefix: "/rentals/" },
] as const;

function normalizePathname(pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return normalized.length > 1 ? normalized.replace(/\/+$/, "") : normalized;
}

function canonicalPathFor(slug: string, routeSlug: string | null) {
  if (!routeSlug) return slug;
  return slug.replace("[slug]", routeSlug);
}

export function resolveTenantRouteMatch(
  pathname: string | null | undefined,
): TenantRouteMatch | null {
  if (!pathname) return null;

  const normalized = normalizePathname(pathname);
  const staticPageKey = staticTenantPageKeys[normalized];
  if (staticPageKey) {
    return { pageKey: staticPageKey, routeSlug: null };
  }

  for (const route of dynamicTenantPageKeys) {
    if (!normalized.startsWith(route.prefix)) continue;
    const routeSlug = decodeURIComponent(normalized.slice(route.prefix.length));
    if (!routeSlug || routeSlug.includes("/")) return null;
    return { pageKey: route.pageKey, routeSlug };
  }

  return null;
}

export function findTemplatePage(templateKey: string, pageKey: string) {
  return getTemplatePageInventoryStrict(templateKey).pages.find(
    (page) => page.pageKey === pageKey,
  );
}

export function isTemplatePageSupported(templateKey: string, pageKey: string) {
  try {
    return Boolean(findTemplatePage(templateKey, pageKey));
  } catch {
    return false;
  }
}

export function resolveTenantRegistryPageInfo(
  templateKey: string | undefined,
  pathname: string | null | undefined,
): RegistryPageInfo {
  const match = resolveTenantRouteMatch(pathname);
  if (!templateKey || !match) {
    return {
      pageDisabled: false,
      pageNotSupported: false,
      routeSlug: match?.routeSlug ?? null,
      ...(match?.pageKey ? { pageKey: match.pageKey } : {}),
    };
  }

  try {
    const page = findTemplatePage(templateKey, match.pageKey);

    return {
      ...(page
        ? { canonicalPath: canonicalPathFor(page.slug, match.routeSlug) }
        : {}),
      pageDisabled: false,
      pageKey: match.pageKey,
      pageNotSupported: !page,
      routeSlug: match.routeSlug,
    };
  } catch {
    return {
      pageDisabled: false,
      pageKey: match.pageKey,
      pageNotSupported: true,
      routeSlug: match.routeSlug,
    };
  }
}
