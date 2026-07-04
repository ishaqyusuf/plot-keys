import { createPrismaClient, getPublishedBlogPostBySlug } from "@plotkeys/db";
import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import {
  resolvePage,
  sampleHomePage,
  sampleTheme,
} from "@plotkeys/section-registry";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import type { JSX } from "react";

import {
  applyListingOverviewQuery,
  isListingOverviewPage,
  parseListingOverviewQuery,
  type ListingOverviewSearchParams,
} from "./listing-overview";
import { parseTenantRenderMode } from "./render-mode";
import { isTemplatePageSupported } from "./tenant-route-map";
import {
  resolveTenantContext,
  resolveTenantShell,
  type TenantContext,
} from "./resolve-tenant";

export type TenantPageSearchParams = ListingOverviewSearchParams & {
  hostname?: string;
  renderMode?: string;
  subdomain?: string;
};

export type TenantPageRouteProps<
  TParams = Record<string, string | undefined>,
> = {
  params?: Promise<TParams>;
  searchParams?: Promise<TenantPageSearchParams>;
};

type TenantPageOptions = {
  pageKey: string;
  routeSlug?: string | null;
  searchParams?: Promise<TenantPageSearchParams>;
};

type TenantMetadataOptions = {
  pageKey: string;
  routeSlug?: string | null;
};

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

async function resolveBlogPostForPage(
  tenant: TenantContext,
  pageKey: string,
  routeSlug: string | null | undefined,
) {
  if (pageKey !== "blog-post" || !routeSlug) return null;

  const prisma = createPrismaClient().db;
  if (!prisma) return null;

  return getPublishedBlogPostBySlug(prisma, tenant.company.id, routeSlug);
}

function buildTenantSnapshot(
  tenant: TenantContext,
  currentBlogPost: Awaited<ReturnType<typeof resolveBlogPostForPage>>,
  liveListings: TenantContext["liveListings"],
) {
  return {
    companyName: tenant.company.name,
    companyLogoUrl: tenant.company.logoUrl,
    content: tenant.publishedConfig.contentJson,
    currentBlogPost: currentBlogPost
      ? {
          content: currentBlogPost.content,
          excerpt: currentBlogPost.excerpt,
          featuredImageUrl: currentBlogPost.featuredImage,
          id: currentBlogPost.id,
          publishedAt: currentBlogPost.publishedAt?.toISOString() ?? null,
          slug: currentBlogPost.slug,
          title: currentBlogPost.title,
        }
      : null,
    liveAgents: tenant.liveAgents,
    liveBlogPosts: tenant.liveBlogPosts,
    liveListings,
    market: tenant.company.market ?? tenant.company.name,
    subdomain: tenant.company.slug,
    theme: tenant.publishedConfig.themeJson,
  };
}

async function renderHomeFallback(searchParams: TenantPageSearchParams) {
  const requestHeaders = await headers();
  const tenantHostname =
    requestHeaders.get("x-tenant-hostname") || searchParams.hostname || null;
  const tenantSubdomain =
    requestHeaders.get("x-tenant-subdomain") || searchParams.subdomain || null;
  const fallbackSections = sampleHomePage.sections.map((section) =>
    renderSection(section, sampleTheme),
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

function renderUnavailablePage() {
  return (
    <main className="flex min-h-[50vh] items-center justify-center px-4 py-16 text-sm text-muted-foreground">
      This page is not available yet.
    </main>
  );
}

export async function generateTenantPageMetadata({
  pageKey,
  routeSlug,
}: TenantMetadataOptions): Promise<Metadata> {
  const shell = await resolveTenantShell();
  if (!shell) return {};

  if (!isTemplatePageSupported(shell.templateKey, pageKey)) return {};

  if (pageKey === "blog-post" && routeSlug) {
    const prisma = createPrismaClient().db;
    if (prisma) {
      const post = await getPublishedBlogPostBySlug(
        prisma,
        shell.company.id,
        routeSlug,
      );

      if (post) {
        const title = post.title;
        const description =
          post.excerpt ?? `${shell.company.name} blog article`;
        const ogImage = post.featuredImage || shell.company.logoUrl;

        return {
          title,
          description,
          openGraph: {
            title,
            description,
            type: "article",
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
    }
  }

  const seo = shell.templateConfig.seo?.[pageKey];
  const title = seo?.title || shell.company.name;
  const description =
    seo?.description ||
    (shell.company.market
      ? `${shell.company.name} — Real estate in ${shell.company.market}.`
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

export async function renderTenantPage({
  pageKey,
  routeSlug,
  searchParams,
}: TenantPageOptions) {
  const sp = (await searchParams) ?? {};
  const renderMode = parseTenantRenderMode(sp.renderMode ?? null);
  const tenant = await resolveTenantContext(sp);

  if (!tenant) {
    return pageKey === "home" ? renderHomeFallback(sp) : renderUnavailablePage();
  }

  if (!isTemplatePageSupported(tenant.templateKey, pageKey)) {
    notFound();
  }

  const currentBlogPost = await resolveBlogPostForPage(
    tenant,
    pageKey,
    routeSlug,
  );

  if (pageKey === "blog-post" && !currentBlogPost) {
    notFound();
  }

  const resolvedListings = isListingOverviewPage(pageKey)
    ? applyListingOverviewQuery(
        tenant.liveListings,
        parseListingOverviewQuery(sp),
      ).items
    : tenant.liveListings;

  const resolved = resolvePage(
    tenant.templateKey,
    pageKey,
    buildTenantSnapshot(tenant, currentBlogPost, resolvedListings),
    renderMode,
  );

  if (resolved.sections.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm text-muted-foreground">
          This page is coming soon.
        </p>
      </main>
    );
  }

  return resolved.sections
    .filter((section) => tenant.templateConfig.visibleSections?.[section.type] !== false)
    .map((section) => renderSection(section, resolved.theme));
}

export function createTenantPageRoute(pageKey: string) {
  async function Page({
    params,
    searchParams,
  }: TenantPageRouteProps<{ slug?: string }>) {
    const resolvedParams = (await params) ?? {};
    return renderTenantPage({
      pageKey,
      routeSlug: resolvedParams.slug ?? null,
      searchParams,
    });
  }

  async function generateMetadata({
    params,
  }: TenantPageRouteProps<{ slug?: string }>) {
    const resolvedParams = (await params) ?? {};
    return generateTenantPageMetadata({
      pageKey,
      routeSlug: resolvedParams.slug ?? null,
    });
  }

  return { Page, generateMetadata };
}
