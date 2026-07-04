import type { LivePreviewData } from "@plotkeys/db/queries";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import { resolveWebsitePresentation } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import { Button } from "@plotkeys/ui/button";
import { Globe2 } from "lucide-react";
import Link from "next/link";
import type { JSX } from "react";

import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
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
} from "@/components/dashboard/dashboard-page";

type ReadyPreview = Extract<LivePreviewData, { status: "ready" }>;

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

function LivePreviewUnavailable({
  description,
  title,
}: {
  description: string;
  title: string;
}) {
  return (
    <DashboardPage>
      <DashboardEmptyState
        description={description}
        icon={<Globe2 className="size-5" />}
        title={title}
      />
    </DashboardPage>
  );
}

function LivePreviewReady({ preview }: { preview: ReadyPreview }) {
  const { agents, company, featuredProperties, publishedConfiguration } =
    preview;
  const presentation = resolveWebsitePresentation({
    companyName: company.name,
    content: publishedConfiguration.contentJson,
    liveAgents: agents.map((agent) => ({
      bio: agent.bio,
      id: agent.id,
      imageUrl: agent.imageUrl,
      name: agent.name,
      title: agent.title,
    })),
    liveListings: featuredProperties.map((property) => ({
      id: property.id,
      imageUrl: property.imageUrl,
      location: property.location,
      price: property.price,
      specs: property.specs,
      title: property.title,
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
            {preview.tenantDomain ? (
              <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Hostname: {preview.tenantDomain.hostname}
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

export function LivePreview({ preview }: { preview: LivePreviewData }) {
  switch (preview.status) {
    case "database-unavailable":
      return (
        <LivePreviewUnavailable
          description="`DATABASE_URL` is not configured for live-site previews."
          title="Live preview is unavailable"
        />
      );
    case "company-not-found":
      return (
        <LivePreviewUnavailable
          description="No company found for that slug."
          title="Company not found"
        />
      );
    case "configuration-not-found":
      return (
        <LivePreviewUnavailable
          description="No published site configuration exists for this tenant yet."
          title="No published site configuration"
        />
      );
    case "ready":
      return <LivePreviewReady preview={preview} />;
  }
}
