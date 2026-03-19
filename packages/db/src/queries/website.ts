/**
 * Website and WebsiteVersion persistence helpers.
 *
 * Phase 3: Read cutover — new read helpers prefer Website/WebsiteVersion
 * and fall back to SiteConfiguration for companies that pre-date the
 * dual-write migration.
 */

import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Website
// ---------------------------------------------------------------------------

export async function findWebsiteForCompany(db: Db, companyId: string) {
  return db.website.findFirst({
    include: { versions: { orderBy: { versionNumber: "desc" }, take: 1 } },
    where: { companyId, deletedAt: null },
  });
}

/**
 * Phase 3 read helper — resolves the active draft configuration for a company.
 * Prefers the WebsiteVersion draft; falls back to SiteConfiguration if no
 * Website record exists yet (pre-migration companies).
 */
export async function resolveActiveDraftForCompany(db: Db, companyId: string) {
  const website = await db.website.findFirst({
    where: { companyId, deletedAt: null },
  });

  if (website) {
    const draftVersion = await db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      where: { status: "draft", websiteId: website.id },
    });

    if (draftVersion) {
      return {
        source: "website_version" as const,
        id: draftVersion.id,
        websiteId: website.id,
        name: draftVersion.name ?? "Draft",
        status: draftVersion.status,
        templateKey: website.templateKey,
        contentJson: draftVersion.contentJson as Record<string, string>,
        themeJson: draftVersion.themeJson as Record<string, string>,
        createdAt: draftVersion.createdAt,
        updatedAt: draftVersion.updatedAt,
        versionNumber: draftVersion.versionNumber,
      };
    }
  }

  // Fallback: read from SiteConfiguration
  const config = await db.siteConfiguration.findFirst({
    orderBy: { createdAt: "desc" },
    where: { companyId, status: "draft" },
  });

  if (!config) return null;

  return {
    source: "site_configuration" as const,
    id: config.id,
    websiteId: null,
    name: config.name,
    status: config.status,
    templateKey: config.templateKey,
    contentJson: config.contentJson as Record<string, string>,
    themeJson: config.themeJson as Record<string, string>,
    createdAt: config.createdAt,
    updatedAt: config.updatedAt,
    versionNumber: null,
  };
}

/**
 * Phase 3 read helper — resolves the published configuration for a company.
 * Prefers the published WebsiteVersion; falls back to published SiteConfiguration.
 */
export async function resolvePublishedForCompany(db: Db, companyId: string) {
  const website = await db.website.findFirst({
    where: { companyId, deletedAt: null },
  });

  if (website) {
    const published = await db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      where: { status: "published", websiteId: website.id },
    });

    if (published) {
      return {
        source: "website_version" as const,
        id: published.id,
        websiteId: website.id,
        name: published.name ?? "Published",
        status: published.status,
        templateKey: website.templateKey,
        contentJson: published.contentJson as Record<string, string>,
        themeJson: published.themeJson as Record<string, string>,
        publishedAt: published.publishedAt,
        versionNumber: published.versionNumber,
      };
    }
  }

  // Fallback
  const config = await db.siteConfiguration.findFirst({
    orderBy: { createdAt: "desc" },
    where: { companyId, status: "published" },
  });

  if (!config) return null;

  return {
    source: "site_configuration" as const,
    id: config.id,
    websiteId: null,
    name: config.name,
    status: config.status,
    templateKey: config.templateKey,
    contentJson: config.contentJson as Record<string, string>,
    themeJson: config.themeJson as Record<string, string>,
    publishedAt: config.publishedAt,
    versionNumber: null,
  };
}

export async function upsertWebsite(
  db: Db,
  input: {
    companyId: string;
    subdomain?: string | null;
    templateKey: string;
  },
) {
  return db.website.upsert({
    create: {
      companyId: input.companyId,
      subdomain: input.subdomain,
      templateKey: input.templateKey,
    },
    update: {
      subdomain: input.subdomain,
      templateKey: input.templateKey,
    },
    where: { companyId: input.companyId },
  });
}

// ---------------------------------------------------------------------------
// WebsiteVersion
// ---------------------------------------------------------------------------

export async function findPublishedWebsiteVersion(db: Db, websiteId: string) {
  return db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { status: "published", websiteId },
  });
}

/**
 * Returns the latest draft version for a website, or creates one if none
 * exists. Version numbers are auto-incremented from the current max.
 */
export async function getOrCreateDraftVersion(
  db: Db,
  input: {
    contentJson: Record<string, string>;
    createdById: string;
    themeJson: Record<string, string>;
    websiteId: string;
  },
) {
  const existing = await db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { status: "draft", websiteId: input.websiteId },
  });

  if (existing) return existing;

  const latest = await db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { websiteId: input.websiteId },
  });

  return db.websiteVersion.create({
    data: {
      contentJson: input.contentJson,
      createdById: input.createdById,
      themeJson: input.themeJson,
      updatedById: input.createdById,
      versionNumber: (latest?.versionNumber ?? 0) + 1,
      websiteId: input.websiteId,
    },
  });
}

/**
 * Updates the content and/or theme of an existing draft WebsiteVersion.
 */
export async function updateDraftVersion(
  db: Db,
  input: {
    contentJson?: Record<string, string>;
    themeJson?: Record<string, string>;
    updatedById: string;
    versionId: string;
  },
) {
  return db.websiteVersion.update({
    data: {
      ...(input.contentJson ? { contentJson: input.contentJson } : {}),
      ...(input.themeJson ? { themeJson: input.themeJson } : {}),
      updatedById: input.updatedById,
    },
    where: { id: input.versionId },
  });
}

/**
 * Publishes a draft version, archiving the previously published version.
 */
export async function publishWebsiteVersion(
  db: Db,
  input: {
    companyId: string;
    name?: string;
    updatedById: string;
    versionId: string;
    websiteId: string;
  },
) {
  await db.$transaction([
    // Archive the current published version
    db.websiteVersion.updateMany({
      data: { status: "archived", updatedById: input.updatedById },
      where: { status: "published", websiteId: input.websiteId },
    }),
    // Promote the draft to published
    db.websiteVersion.update({
      data: {
        name: input.name,
        publishedAt: new Date(),
        status: "published",
        updatedById: input.updatedById,
      },
      where: { id: input.versionId },
    }),
    // Point the website at the new published version
    db.website.update({
      data: { publishedVersionId: input.versionId },
      where: { id: input.websiteId },
    }),
  ]);
}
