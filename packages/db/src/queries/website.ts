/**
 * Website and WebsiteVersion persistence helpers.
 *
 * These queries support Phase 2 of the SiteConfiguration → Website migration:
 * dual-write mode where application code writes to both models simultaneously.
 *
 * In Phase 1 (current), these helpers may be called alongside the existing
 * SiteConfiguration queries without replacing them.
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

export async function findPublishedWebsiteVersion(
  db: Db,
  websiteId: string,
) {
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
