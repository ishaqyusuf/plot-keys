import { createPrismaClient } from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  resolveWebsitePresentation,
  sampleHomePage,
  sampleTheme,
} from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { extractTenantHostname } from "@plotkeys/utils";
import { headers } from "next/headers";
import Link from "next/link";
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
  const requestedHostname =
    extractTenantHostname(params.hostname) ||
    extractTenantHostname(requestHeaders.get("x-forwarded-host")) ||
    extractTenantHostname(requestHeaders.get("host"));
  const subdomain = params.subdomain;
  let matchedHostname: string | null = requestedHostname;

  let preview = {
    page: sampleHomePage,
    theme: sampleTheme,
  };

  if (prisma) {
    const tenantDomain = requestedHostname
      ? await prisma.tenantDomain.findFirst({
          include: {
            company: true,
          },
          where: {
            deletedAt: null,
            hostname: requestedHostname,
          },
        })
      : null;
    const company =
      tenantDomain?.company ??
      (subdomain
        ? await prisma.company.findFirst({
            where: {
              deletedAt: null,
              slug: subdomain,
            },
          })
        : null);

    if (company) {
      const publishedConfiguration = await prisma.siteConfiguration.findFirst({
        where: {
          companyId: company.id,
          deletedAt: null,
          status: "published",
        },
      });

      if (publishedConfiguration) {
        matchedHostname = tenantDomain?.hostname ?? matchedHostname;
        preview = resolveWebsitePresentation({
          companyName: company.name,
          content: publishedConfiguration.contentJson as Record<string, string>,
          market: company.market ?? company.name,
          subdomain: company.slug,
          templateKey: publishedConfiguration.templateKey,
          theme: publishedConfiguration.themeJson as Record<string, string>,
        });
      }
    }
  }

  return (
    <main className="min-h-screen px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-border bg-card px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Tenant website preview
            </p>
            <p className="mt-1">
              {matchedHostname
                ? `Published view for ${matchedHostname}`
                : subdomain
                  ? `Published view for ${subdomain}.plotkeys.com`
                  : "Use the tenant hostname or add ?subdomain=company-slug to load a published tenant site."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default">
              {subdomain ? "Published config" : "Sample template"}
            </Badge>
            {subdomain ? (
              <Button asChild size="sm" variant="secondary">
                <Link href={`/?subdomain=${subdomain}`}>Refresh preview</Link>
              </Button>
            ) : null}
          </div>
        </div>

        {preview.page.sections.map((section) =>
          renderSection(section, preview.theme),
        )}
      </div>
    </main>
  );
}
