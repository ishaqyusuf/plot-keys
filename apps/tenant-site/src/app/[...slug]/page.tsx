/**
 * Catch-all inner page route.
 *
 * Handles all paths beyond the home page ("/") for register-based templates:
 *   /listings      → pageKey "listings"
 *   /about         → pageKey "about"
 *   /contact       → pageKey "contact"
 *   /agents        → pageKey "agents"
 *   /services      → pageKey "services"
 *   /areas         → pageKey "area-guides"
 *   … etc.
 *
 * Resolution order:
 * 1. Reconstruct the incoming path from Next.js slug segments.
 * 2. Look up the page in the active template's page inventory by matching
 *    the path against page slugs (exact match first; dynamic pattern fallback).
 * 3. Call resolvePage() to build the section stack.
 * 4. Render sections with WebsiteRuntimeProvider already applied at layout.
 *
 * Paths with no matching page definition return 404.
 * Pages with an empty section list (login, 404, privacy, etc.) render a
 * minimal placeholder so they are reachable but visually minimal.
 */

import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  getTemplatePageInventory,
  resolvePage,
} from "@plotkeys/section-registry";
import { notFound } from "next/navigation";
import type { JSX } from "react";
import { parseTenantRenderMode } from "../../lib/render-mode";
import { resolveTenantContext } from "../../lib/resolve-tenant";

// ---------------------------------------------------------------------------
// Path → pageKey matching
// ---------------------------------------------------------------------------

/**
 * Returns the pageKey for a given path by walking the template's page
 * inventory. Supports both exact paths ("/listings") and simple dynamic
 * patterns ("/listings/[slug]").
 */
function resolvePageKeyForPath(
  templateKey: string,
  path: string,
): string | null {
  const inventory = getTemplatePageInventory(templateKey);
  const segments = path.split("/").filter(Boolean);

  // Exact match (e.g. "/listings" → "listings")
  const exact = inventory.pages.find((p) => p.slug === path);
  if (exact) return exact.pageKey;

  // Dynamic pattern match — convert "[slug]" to a wildcard and test.
  // e.g. "/listings/[slug]" matches "/listings/some-property-id"
  for (const page of inventory.pages) {
    if (!page.slug.includes("[")) continue;
    const patternSegments = page.slug.split("/").filter(Boolean);
    if (patternSegments.length !== segments.length) continue;
    const matches = patternSegments.every(
      (seg, i) => seg.startsWith("[") || seg === segments[i],
    );
    if (matches) return page.pageKey;
  }

  return null;
}

// ---------------------------------------------------------------------------
// Section renderer
// ---------------------------------------------------------------------------

function renderSection(
  section: HomeSectionDefinition,
  theme: ReturnType<typeof resolvePage>["theme"],
): JSX.Element {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: typeof theme;
  }) => JSX.Element;

  return (
    <SectionComponent key={section.id} config={section.config} theme={theme} />
  );
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------

type InnerPageProps = {
  params: Promise<{ slug: string[] }>;
  searchParams?: Promise<{
    hostname?: string;
    renderMode?: string;
    subdomain?: string;
  }>;
};

export default async function InnerPage({
  params,
  searchParams,
}: InnerPageProps) {
  const { slug: segments } = await params;
  const sp = (await searchParams) ?? {};
  const renderMode = parseTenantRenderMode(sp.renderMode ?? null);

  // Reconstruct path: ["listings"] → "/listings", ["blog", "my-post"] → "/blog/my-post"
  const path = `/${segments.join("/")}`;

  const tenant = await resolveTenantContext(sp);
  if (!tenant) {
    // No published site — show minimal fallback instead of 404 so the URL
    // still resolves to something when the site isn't live yet.
    return (
      <main className="flex min-h-[50vh] items-center justify-center px-4 py-16 text-sm text-muted-foreground">
        This page is not available yet.
      </main>
    );
  }

  const pageKey = resolvePageKeyForPath(tenant.templateKey, path);
  if (!pageKey) {
    notFound();
  }

  const resolved = resolvePage(
    tenant.templateKey,
    pageKey,
    {
      companyName: tenant.company.name,
      companyLogoUrl: tenant.company.logoUrl,
      content: tenant.publishedConfig.contentJson,
      liveAgents: tenant.liveAgents,
      liveListings: tenant.liveListings,
      market: tenant.company.market ?? tenant.company.name,
      subdomain: tenant.company.slug,
      theme: tenant.publishedConfig.themeJson,
    },
    renderMode,
  );

  // Pages with no sections (login, signup, privacy, terms, etc.) show a
  // blank layout — the shell nav/footer from layout.tsx is still present.
  if (resolved.sections.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm text-muted-foreground">
          This page is coming soon.
        </p>
      </main>
    );
  }

  const visibleSections = tenant.templateConfig.visibleSections;
  const renderedSections = resolved.sections
    .filter((s) => visibleSections?.[s.type] !== false)
    .map((s) => renderSection(s, resolved.theme));

  return <>{renderedSections}</>;
}
