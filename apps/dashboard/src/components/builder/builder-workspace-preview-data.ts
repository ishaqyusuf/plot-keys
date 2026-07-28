import type {
  LiveAgentItem,
  LiveBlogPostItem,
  LiveListingItem,
  ResolvedWebsitePresentation,
  TemplateConfig,
} from "@plotkeys/section-registry";
import {
  deserializeTemplateConfig,
  getTemplatePageInventoryStrict,
  resolveWebsitePresentation,
} from "@plotkeys/section-registry";
import { buildTenantSiteUrl } from "@plotkeys/utils";

export type BuilderWorkspacePageNavItem = {
  label: string;
  pageKey: string;
  slug: string;
};

type BuilderWorkspacePreviewDataInput = {
  agents: LiveAgentItem[];
  blogPosts: Array<
    Omit<LiveBlogPostItem, "featuredImageUrl" | "publishedAt"> & {
      featuredImage?: string | null;
      publishedAt?: Date | null;
    }
  >;
  companyName: string;
  companySlug: string;
  content: Record<string, string>;
  currentOrigin: string;
  featuredProperties: LiveListingItem[];
  pageKey?: string;
  previewPath?: string;
  templateKey: string;
  theme: Record<string, string>;
};

type BuilderWorkspacePreviewData = {
  availablePages: BuilderWorkspacePageNavItem[];
  currentPageLiveSiteUrl: string;
  liveSiteUrl: string;
  preview: ResolvedWebsitePresentation;
  sectionTypes: string[];
  selectedPageKey: string;
  selectedPageLabel: string;
  selectedPageSlug: string;
  templateConfig: TemplateConfig;
};

export function resolveBuilderWorkspacePreviewData({
  agents,
  blogPosts,
  companyName,
  companySlug,
  content,
  currentOrigin,
  featuredProperties,
  pageKey,
  previewPath,
  templateKey,
  theme,
}: BuilderWorkspacePreviewDataInput): BuilderWorkspacePreviewData {
  const liveSiteUrl = buildTenantSiteUrl(companySlug, {
    currentOrigin,
  });
  const pageInventory = getTemplatePageInventoryStrict(templateKey);
  const availablePages: BuilderWorkspacePageNavItem[] = pageInventory.pages.map(
    (page) => ({
      label: page.label,
      pageKey: page.pageKey,
      slug: page.slug,
    }),
  );
  const resolvedPageKey =
    pageKey ??
    (() => {
      if (!previewPath || previewPath === "/") return "home";
      const matched = pageInventory.pages.find(
        (page) => page.slug === previewPath,
      );
      return matched?.pageKey ?? "home";
    })();
  const selectedPage =
    availablePages.find((page) => page.pageKey === resolvedPageKey) ??
    availablePages[0];
  const selectedPageKey = selectedPage?.pageKey ?? "home";
  const selectedPageLabel = selectedPage?.label ?? "Home";
  const selectedPageSlug = selectedPage?.slug ?? "/";
  const currentPageLiveSiteUrl = selectedPageSlug.includes("[")
    ? liveSiteUrl
    : buildTenantSiteUrl(companySlug, {
        currentOrigin,
        pathname: selectedPageSlug,
      });
  const preview = resolveWebsitePresentation({
    companyName,
    content,
    liveAgents: agents.map((agent) => ({
      bio: agent.bio,
      id: agent.id,
      imageUrl: agent.imageUrl,
      name: agent.name,
      title: agent.title,
    })),
    liveBlogPosts: blogPosts.map((post) => ({
      content: post.content,
      excerpt: post.excerpt,
      featuredImageUrl: post.featuredImage,
      id: post.id,
      publishedAt: post.publishedAt?.toISOString() ?? null,
      slug: post.slug,
      title: post.title,
    })),
    liveListings: featuredProperties.map((property) => ({
      id: property.id,
      imageUrl: property.imageUrl,
      location: property.location,
      price: property.price,
      specs: property.specs,
      title: property.title,
    })),
    market: companyName,
    pageKey: selectedPageKey,
    renderMode: "draft",
    subdomain: companySlug,
    templateKey,
    theme,
  });
  const templateConfig = deserializeTemplateConfig(theme);
  const sectionTypes = Array.from(
    new Set(
      preview.page.sections.map(
        ({ component: _component, ...rest }) => rest.type,
      ),
    ),
  );

  return {
    availablePages,
    currentPageLiveSiteUrl,
    liveSiteUrl,
    preview,
    sectionTypes,
    selectedPageKey,
    selectedPageLabel,
    selectedPageSlug,
    templateConfig,
  };
}
