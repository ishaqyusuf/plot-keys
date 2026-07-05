/**
 * Shared tenant context resolution for the tenant-site.
 *
 * Resolves the tenant company, published configuration, and register
 * metadata from middleware-injected request headers. Returns null when
 * no published site can be found for the incoming request.
 *
 * Used by all page routes so tenant resolution logic is defined once.
 */

import {
  createPrismaClient,
  listAgentsForCompany,
  listFeaturedProperties,
  listPublishedBlogPostsForCompany,
  resolvePublishedForCompany,
  resolveTenantByHostname,
} from "@plotkeys/db";
import type { TemplateTier } from "@plotkeys/section-registry";
import {
  deserializeTemplateConfig,
  getRegisterTemplate,
  getTemplateDefinition,
} from "@plotkeys/section-registry";
import { extractTenantHostname } from "@plotkeys/utils";
import { headers } from "next/headers";

function resolveTenantTemplateConfig(
  templateKey: string,
  themeJson: Record<string, string>,
) {
  const template = getTemplateDefinition(templateKey);

  return deserializeTemplateConfig({
    ...template.defaultTheme,
    ...themeJson,
  });
}

export type TenantContext = {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    market: string | null;
  };
  publishedConfig: {
    contentJson: Record<string, string>;
    themeJson: Record<string, string>;
    templateKey: string;
    websiteId: string;
  };
  templateKey: string;
  /** Concrete register template key, if this is a register template. */
  registerTemplateKey: string | undefined;
  /** Plan tier if this is a register template, otherwise undefined. */
  tier: TemplateTier | undefined;
  /** Deserialized template config (color system, font, style preset, etc.). */
  templateConfig: ReturnType<typeof deserializeTemplateConfig>;
  liveListings: {
    id?: string;
    imageUrl?: string | null;
    location: string;
    price?: string | null;
    specs?: string | null;
    title: string;
  }[];
  liveAgents: {
    id: string;
    imageUrl?: string | null;
    name: string;
    title?: string | null;
    bio?: string | null;
  }[];
  liveBlogPosts: {
    content?: string | null;
    excerpt?: string | null;
    featuredImageUrl?: string | null;
    id: string;
    publishedAt?: string | null;
    slug: string;
    title: string;
  }[];
};

/**
 * Resolves the full tenant context for a page request.
 *
 * Resolution order:
 * 1. Middleware-injected `x-tenant-hostname` header → `TenantDomain` lookup
 * 2. Middleware-injected `x-tenant-subdomain` header → company slug lookup
 * 3. `?hostname=` / `?subdomain=` query params (local dev + preview fallback)
 *
 * Returns null when no published site is found.
 */
export async function resolveTenantContext(searchParams?: {
  hostname?: string;
  subdomain?: string;
}): Promise<TenantContext | null> {
  const prisma = createPrismaClient().db;
  if (!prisma) return null;

  const requestHeaders = await headers();
  const tenantSubdomain =
    requestHeaders.get("x-tenant-subdomain") || searchParams?.subdomain || null;
  const tenantHostname =
    requestHeaders.get("x-tenant-hostname") ||
    extractTenantHostname(searchParams?.hostname) ||
    null;

  // Resolve company
  const resolvedTenant = tenantHostname
    ? await resolveTenantByHostname(prisma, tenantHostname)
    : null;

  const company = resolvedTenant
    ? await prisma.company.findFirst({
        where: { deletedAt: null, id: resolvedTenant.companyId },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          market: true,
        },
      })
    : tenantSubdomain
      ? await prisma.company.findFirst({
          where: { deletedAt: null, slug: tenantSubdomain },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            market: true,
          },
        })
      : null;

  if (!company) return null;

  const publishedRaw = await resolvePublishedForCompany(prisma, company.id);
  if (!publishedRaw) return null;

  const publishedConfig = {
    contentJson: publishedRaw.contentJson as Record<string, string>,
    themeJson: publishedRaw.themeJson as Record<string, string>,
    templateKey: publishedRaw.templateKey,
    websiteId: publishedRaw.websiteId,
  };

  const registerVariant = getRegisterTemplate(publishedConfig.templateKey);
  const templateConfig = resolveTenantTemplateConfig(
    publishedConfig.templateKey,
    publishedConfig.themeJson,
  );

  const [featuredProperties, agentsPage, blogPosts] = await Promise.all([
    listFeaturedProperties(prisma, company.id),
    listAgentsForCompany(prisma, company.id, { limit: 10 }),
    listPublishedBlogPostsForCompany(prisma, company.id, { limit: 24 }),
  ]);

  return {
    company,
    publishedConfig,
    templateKey: publishedConfig.templateKey,
    registerTemplateKey: registerVariant?.key,
    tier: registerVariant?.tier,
    templateConfig,
    liveListings: featuredProperties.map((p) => ({
      id: p.id,
      imageUrl: p.imageUrl,
      location: p.location,
      price: p.price,
      slug: p.id,
      specs: p.specs,
      title: p.title,
    })),
    liveAgents: agentsPage.data.map((a) => ({
      id: a.id,
      imageUrl: a.imageUrl,
      name: a.name,
      slug: a.id,
      title: a.title,
      bio: a.bio,
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
  };
}

// ---------------------------------------------------------------------------
// Shell resolver — layout-level only (no live data fetch)
// ---------------------------------------------------------------------------

export type TenantShell = {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    market: string | null;
  };
  content: Record<string, string>;
  templateKey: string;
  registerTemplateKey: string | undefined;
  tier: TemplateTier | undefined;
  templateConfig: ReturnType<typeof deserializeTemplateConfig>;
};

/**
 * Lightweight tenant resolver for the layout shell.
 * Fetches company + published theme/content — no live listings or agents.
 * Used by the root layout to provide nav, footer, and WebsiteRuntimeProvider.
 */
export async function resolveTenantShell(): Promise<TenantShell | null> {
  const prisma = createPrismaClient().db;
  if (!prisma) return null;

  const requestHeaders = await headers();
  const tenantSubdomain = requestHeaders.get("x-tenant-subdomain") || null;
  const tenantHostname = requestHeaders.get("x-tenant-hostname") || null;

  const resolvedTenant = tenantHostname
    ? await resolveTenantByHostname(prisma, tenantHostname)
    : null;

  const company = resolvedTenant
    ? await prisma.company.findFirst({
        where: { deletedAt: null, id: resolvedTenant.companyId },
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          market: true,
        },
      })
    : tenantSubdomain
      ? await prisma.company.findFirst({
          where: { deletedAt: null, slug: tenantSubdomain },
          select: {
            id: true,
            name: true,
            slug: true,
            logoUrl: true,
            market: true,
          },
        })
      : null;

  if (!company) return null;

  const publishedRaw = await resolvePublishedForCompany(prisma, company.id);
  if (!publishedRaw) return null;

  const registerVariant = getRegisterTemplate(publishedRaw.templateKey);
  const templateConfig = resolveTenantTemplateConfig(
    publishedRaw.templateKey,
    publishedRaw.themeJson as Record<string, string>,
  );

  return {
    company,
    content: publishedRaw.contentJson as Record<string, string>,
    templateKey: publishedRaw.templateKey,
    registerTemplateKey: registerVariant?.key,
    tier: registerVariant?.tier,
    templateConfig,
  };
}
