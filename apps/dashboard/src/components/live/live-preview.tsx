import type { LivePreviewData } from "@plotkeys/db/queries";
import { resolveWebsitePresentation } from "@plotkeys/section-registry";

import { LivePreviewFrame } from "./live-preview-frame";
import { LivePreviewHeader } from "./live-preview-header";
import { LivePreviewUnavailable } from "./live-preview-unavailable";

type ReadyPreview = Extract<LivePreviewData, { status: "ready" }>;

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
    <div className="mx-auto flex w-full max-w-[82rem] flex-col gap-5">
      <LivePreviewHeader
        companyName={company.name}
        configurationName={publishedConfiguration.name}
        hostname={preview.tenantDomain?.hostname}
      />
      <LivePreviewFrame
        sections={presentation.page.sections}
        theme={presentation.theme}
      />
    </div>
  );
}

export function LivePreview({ preview }: { preview: LivePreviewData }) {
  switch (preview.status) {
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
