import {
  createPrismaClient,
  listAgentsForCompany,
  listFeaturedProperties,
} from "@plotkeys/db";
import { resolvePublishedForCompany } from "@plotkeys/db/queries/website";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import { resolveWebsitePresentation } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { extractTenantHostname } from "@plotkeys/utils";
import { Globe2 } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

import { DashboardEmptyState } from "../../../components/dashboard/dashboard-empty-state";
import {
  DashboardPage,
  DashboardPageActions,
  DashboardPageDescription,
  DashboardPageEyebrow,
  DashboardPageHeader,
  DashboardPageHeaderRow,
  DashboardPageIntro,
  DashboardPageTitle,
  DashboardSection,
} from "../../../components/dashboard/dashboard-page";
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
      <DashboardPage>
        <DashboardEmptyState
          description="`DATABASE_URL` is not configured for live-site previews."
          icon={<Globe2 className="size-5" />}
          title="Live preview is unavailable"
        />
      </DashboardPage>
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
      <DashboardPage>
        <DashboardEmptyState
          description="No company found for that slug."
          icon={<Globe2 className="size-5" />}
          title="Company not found"
        />
      </DashboardPage>
    );
  }

  const publishedConfiguration = await resolvePublishedForCompany(
    prisma,
    company.id,
  );

  if (!publishedConfiguration) {
    return (
      <DashboardPage>
        <DashboardEmptyState
          description="No published site configuration exists for this tenant yet."
          icon={<Globe2 className="size-5" />}
          title="No published site configuration"
        />
      </DashboardPage>
    );
  }

  // Fetch live property + agent data for PropertyGrid and AgentShowcase sections
  const [featuredProperties, agents] = await Promise.all([
    listFeaturedProperties(prisma, company.id),
    listAgentsForCompany(prisma, company.id, { limit: 10 }),
  ]);

  const presentation = resolveWebsitePresentation({
    companyName: company.name,
    content: publishedConfiguration.contentJson,
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
    subdomain: company.slug,
    templateKey: publishedConfiguration.templateKey,
    theme: publishedConfiguration.themeJson,
  });

  return (
    <DashboardPage className="px-4 py-5 md:px-6 md:py-6">
      <DashboardPageHeader className="mx-auto max-w-[82rem]">
        <DashboardPageHeaderRow>
          <DashboardPageIntro>
            <DashboardPageEyebrow>Published live site</DashboardPageEyebrow>
            <DashboardPageTitle>{company.name}</DashboardPageTitle>
            <DashboardPageDescription>
              This workspace is currently serving{" "}
              <strong>{publishedConfiguration.name}</strong>.
            </DashboardPageDescription>
            {tenantDomain ? (
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Hostname: {tenantDomain.hostname}
              </p>
            ) : null}
          </DashboardPageIntro>
          <DashboardPageActions>
            <Badge variant="default">Published</Badge>
            <Button asChild size="sm" variant="secondary">
              <Link href="/builder">Back to builder</Link>
            </Button>
          </DashboardPageActions>
        </DashboardPageHeaderRow>
      </DashboardPageHeader>

      <DashboardSection className="mx-auto max-w-[82rem]">
        <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-[var(--shadow-soft)] backdrop-blur">
          {presentation.page.sections.map((section) =>
            renderLiveSection(section, presentation.theme),
          )}
        </div>
      </DashboardSection>
    </DashboardPage>
  );
}
