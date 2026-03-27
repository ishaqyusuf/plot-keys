import {
  createPrismaClient,
  listAgentsForCompany,
  listFeaturedProperties,
  resolvePublishedForCompany,
  resolveTenantByHostname,
} from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  deserializeTemplateConfig,
  resolveWebsitePresentation,
  sampleHomePage,
  sampleTheme,
} from "@plotkeys/section-registry";
import { extractTenantHostname } from "@plotkeys/utils";
import { headers } from "next/headers";
import type { JSX } from "react";

function renderSection(
  section: HomeSectionDefinition,
  theme: ReturnType<typeof resolveWebsitePresentation>["theme"],
) {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: typeof theme;
  }) => JSX.Element;

  return (
    <SectionComponent key={section.id} config={section.config} theme={theme} />
  );
}

type TenantWebsiteHomePageProps = {
  searchParams?: Promise<{
    hostname?: string;
    subdomain?: string;
  }>;
};

export default async function TenantWebsiteHomePage({
  searchParams,
}: TenantWebsiteHomePageProps) {
  const params = (await searchParams) ?? {};
  const requestHeaders = await headers();
  const prisma = createPrismaClient().db;

  // Prefer middleware-injected headers; fall back to query params for local dev.
  const tenantSubdomain =
    requestHeaders.get("x-tenant-subdomain") || params.subdomain || null;
  const tenantHostname =
    requestHeaders.get("x-tenant-hostname") ||
    extractTenantHostname(params.hostname) ||
    null;

  const requestedHostname = tenantHostname;
  const subdomain = tenantSubdomain;
  let matchedHostname: string | null = requestedHostname;
  let resolvedCompanySlug: string | null = subdomain;
  let hasPublishedSite = false;

  let preview = {
    page: sampleHomePage,
    theme: sampleTheme,
  };

  if (prisma) {
    // Prefer hostname-based lookup via tenant_domains (handles custom domains).
    // Fall back to slug-based lookup for preview mode (?subdomain= query param).
    const resolvedTenant = requestedHostname
      ? await resolveTenantByHostname(prisma, requestedHostname)
      : null;

    const company = resolvedTenant
      ? await prisma.company.findFirst({
          where: { deletedAt: null, id: resolvedTenant.companyId },
        })
      : subdomain
        ? await prisma.company.findFirst({
            where: { deletedAt: null, slug: subdomain },
          })
        : null;

    if (company) {
      resolvedCompanySlug = company.slug;

      // Phase 3: Prefer WebsiteVersion, fallback to SiteConfiguration
      const publishedConfiguration = await resolvePublishedForCompany(
        prisma,
        company.id,
      );

      if (publishedConfiguration) {
        hasPublishedSite = true;
        matchedHostname = resolvedTenant?.hostname ?? matchedHostname;

        const [featuredProperties, agents] = await Promise.all([
          listFeaturedProperties(prisma, company.id),
          listAgentsForCompany(prisma, company.id, { limit: 10 }),
        ]);

        preview = resolveWebsitePresentation({
          companyName: company.name,
          companyLogoUrl: company.logoUrl,
          content: publishedConfiguration.contentJson as Record<string, string>,
          liveAgents: agents.map((a) => ({
            bio: a.bio,
            id: a.id,
            imageUrl: a.imageUrl,
            name: a.name,
            title: a.title,
          })),
          liveListings: featuredProperties.map((p) => ({
            id: p.id,
            imageUrl: p.imageUrl,
            location: p.location,
            price: p.price,
            specs: p.specs,
            title: p.title,
          })),
          market: company.market ?? company.name,
          renderMode: "live",
          subdomain: company.slug,
          templateKey: publishedConfiguration.templateKey,
          theme: publishedConfiguration.themeJson as Record<string, string>,
        });
      }
    }
  }

  const visibleSections = deserializeTemplateConfig(
    preview.theme,
  ).visibleSections;
  const renderedSections = preview.page.sections
    .filter((section) => visibleSections?.[section.type] !== false)
    .map((section) => renderSection(section, preview.theme));

  if (hasPublishedSite) {
    return renderedSections;
  }

  return (
    <main className="min-h-screen bg-background px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-dashed border-border/80 bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-border/80 bg-card px-6 py-4 text-sm text-muted-foreground md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Preview fallback
            </p>
            <p className="mt-1">
              {matchedHostname
                ? `No published tenant site was found for ${matchedHostname} yet.`
                : resolvedCompanySlug
                  ? `No published tenant site was found for ${resolvedCompanySlug}.plotkeys.com yet.`
                  : "Use the tenant hostname or add ?subdomain=company-slug to load a published tenant site."}
            </p>
          </div>
        </div>
        {renderedSections}
      </div>
    </main>
  );
}
