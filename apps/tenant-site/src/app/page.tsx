import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  resolvePage,
  sampleHomePage,
  sampleTheme,
} from "@plotkeys/section-registry";
import { headers } from "next/headers";
import type { Metadata } from "next";
import type { JSX } from "react";
import { parseTenantRenderMode } from "../lib/render-mode";
import { resolveTenantContext, resolveTenantShell } from "../lib/resolve-tenant";

function renderSection(
  section: HomeSectionDefinition,
  theme: ReturnType<typeof resolvePage>["theme"],
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
    renderMode?: string;
    subdomain?: string;
  }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const shell = await resolveTenantShell();
  if (!shell) return {};

  const seo = shell.templateConfig.seo?.home;
  const title = seo?.title || shell.company.name;
  const description =
    seo?.description ||
    (shell.company.market
      ? `${shell.company.name} — Real estate in ${shell.company.market}. Browse properties, meet agents, and schedule viewings.`
      : `${shell.company.name} — Browse properties, meet agents, and schedule viewings.`);
  const ogImage = seo?.ogImage || shell.company.logoUrl;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      siteName: shell.company.name,
      ...(ogImage ? { images: [{ url: ogImage, alt: title }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export default async function TenantWebsiteHomePage({
  searchParams,
}: TenantWebsiteHomePageProps) {
  const sp = (await searchParams) ?? {};
  const renderMode = parseTenantRenderMode(sp.renderMode ?? null);

  const tenant = await resolveTenantContext(sp);

  if (!tenant) {
    // No published site — show sample home in a dashed fallback card.
    const requestHeaders = await headers();
    const tenantHostname =
      requestHeaders.get("x-tenant-hostname") || sp.hostname || null;
    const tenantSubdomain =
      requestHeaders.get("x-tenant-subdomain") || sp.subdomain || null;

    const fallbackSections = sampleHomePage.sections.map((s) =>
      renderSection(s, sampleTheme),
    );

    return (
      <main className="min-h-screen bg-background px-4 py-5 md:px-6 md:py-6">
        <div className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-dashed border-border/80 bg-card/70 shadow-[var(--shadow-soft)] backdrop-blur">
          <div className="flex flex-col gap-3 border-b border-border/80 bg-card px-6 py-4 text-sm text-muted-foreground md:px-10">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
                Preview fallback
              </p>
              <p className="mt-1">
                {tenantHostname
                  ? `No published tenant site was found for ${tenantHostname} yet.`
                  : tenantSubdomain
                    ? `No published tenant site was found for ${tenantSubdomain}.plotkeys.com yet.`
                    : "Use the tenant hostname or add ?subdomain=company-slug to load a published tenant site."}
              </p>
            </div>
          </div>
          {fallbackSections}
        </div>
      </main>
    );
  }

  const resolved = resolvePage(
    tenant.templateKey,
    "home",
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

  return resolved.sections
    .filter((s) => tenant.templateConfig.visibleSections?.[s.type] !== false)
    .map((s) => renderSection(s, resolved.theme));
}
