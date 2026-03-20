import { createPrismaClient } from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import { resolveWebsitePresentation } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Card, CardContent } from "@plotkeys/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@plotkeys/ui/empty";
import { extractTenantHostname } from "@plotkeys/utils";
import Link from "next/link";
import type { JSX } from "react";

import { requireOnboardedSession } from "../../../lib/session";

function renderLiveSection(
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

type LivePageProps = {
  searchParams?: Promise<{
    hostname?: string;
    subdomain?: string;
  }>;
};

export default async function LivePage({ searchParams }: LivePageProps) {
  const session = await requireOnboardedSession();
  const prisma = createPrismaClient().db;
  const params = (await searchParams) ?? {};

  if (!prisma) {
    return (
      <main className="min-h-screen p-8">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-8">
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Live preview is unavailable</EmptyTitle>
                <EmptyDescription>
                  `DATABASE_URL` is not configured for live-site previews.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </main>
    );
  }

  const hostname = extractTenantHostname(params.hostname);
  const tenantDomain = hostname
    ? await prisma.tenantDomain.findFirst({
        include: {
          company: true,
        },
        where: {
          deletedAt: null,
          hostname,
        },
      })
    : null;
  const company =
    tenantDomain?.company ??
    (await prisma.company.findFirst({
      where: {
        deletedAt: null,
        slug: params.subdomain ?? session.activeMembership.companySlug,
      },
    }));

  if (!company) {
    return (
      <main className="min-h-screen p-8">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-8">
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>Company not found</EmptyTitle>
                <EmptyDescription>
                  No company found for that slug.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </main>
    );
  }

  const publishedConfiguration = await prisma.siteConfiguration.findFirst({
    where: {
      companyId: company.id,
      deletedAt: null,
      status: "published",
    },
  });

  if (!publishedConfiguration) {
    return (
      <main className="min-h-screen p-8">
        <Card className="mx-auto max-w-3xl">
          <CardContent className="p-8">
            <Empty className="border">
              <EmptyHeader>
                <EmptyTitle>No published site configuration</EmptyTitle>
                <EmptyDescription>
                  No published site configuration exists for this tenant yet.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          </CardContent>
        </Card>
      </main>
    );
  }

  const presentation = resolveWebsitePresentation({
    companyName: company.name,
    content: publishedConfiguration.contentJson as Record<string, string>,
    market: company.market ?? company.name,
    subdomain: company.slug,
    templateKey: publishedConfiguration.templateKey,
    theme: publishedConfiguration.themeJson as Record<string, string>,
  });

  return (
    <main className="min-h-screen px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-border bg-card px-6 py-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
              Published live site
            </p>
            <p className="mt-1">
              {company.name} is currently serving{" "}
              <strong>{publishedConfiguration.name}</strong>.
            </p>
            {tenantDomain ? (
              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Hostname: {tenantDomain.hostname}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="default">Published</Badge>
            <Button asChild size="sm" variant="secondary">
              <Link href="/builder">Back to builder</Link>
            </Button>
          </div>
        </div>

        {presentation.page.sections.map((section) =>
          renderLiveSection(section, presentation.theme),
        )}
      </div>
    </main>
  );
}
