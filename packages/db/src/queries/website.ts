/**
 * Website and WebsiteVersion persistence helpers.
 *
 * Phase 4: WebsiteVersion is now the primary read source. SiteConfiguration
 * fallback paths have been removed. All new companies create a Website +
 * WebsiteVersion during onboarding (Phase 2 dual-write).
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
 * Resolves the active draft configuration for a company from WebsiteVersion.
 * Returns null if no Website or draft version exists.
 */
export async function resolveActiveDraftForCompany(db: Db, companyId: string) {
  const website = await db.website.findFirst({
    where: { companyId, deletedAt: null },
  });

  if (!website) return null;

  const draftVersion = await db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { status: "draft", websiteId: website.id },
  });

  if (!draftVersion) return null;

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
    legacyConfigId: draftVersion.legacyConfigId,
  };
}

/**
 * Resolves the published configuration for a company from WebsiteVersion.
 * Returns null if no Website or published version exists.
 */
export async function resolvePublishedForCompany(db: Db, companyId: string) {
  const website = await db.website.findFirst({
    where: { companyId, deletedAt: null },
  });

  if (!website) return null;

  const published = await db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { status: "published", websiteId: website.id },
  });

  if (!published) return null;

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

export async function findDraftWebsiteVersionByIdForCompany(
  db: Db,
  input: {
    companyId: string;
    versionId: string;
  },
) {
  return db.websiteVersion.findFirst({
    include: { website: true },
    where: {
      id: input.versionId,
      status: "draft",
      website: {
        companyId: input.companyId,
        deletedAt: null,
      },
    },
  });
}

/**
 * Ensures the company's website points at the requested template key and that
 * a draft WebsiteVersion exists with the provided content/theme payload.
 *
 * If a draft already exists it is updated in place so builder routes can keep
 * using a single active draft identifier.
 */
export async function upsertDraftWebsiteVersion(
  db: Db,
  input: {
    companyId: string;
    contentJson: Record<string, string>;
    createdById: string;
    name: string;
    subdomain?: string | null;
    templateKey: string;
    themeJson: Record<string, string>;
    updatedById: string;
  },
) {
  const website = await upsertWebsite(db, {
    companyId: input.companyId,
    subdomain: input.subdomain,
    templateKey: input.templateKey,
  });

  const existingDraft = await db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { status: "draft", websiteId: website.id },
  });

  if (existingDraft) {
    return db.websiteVersion.update({
      data: {
        contentJson: input.contentJson,
        name: input.name,
        themeJson: input.themeJson,
        updatedById: input.updatedById,
      },
      where: { id: existingDraft.id },
    });
  }

  const latest = await db.websiteVersion.findFirst({
    orderBy: { versionNumber: "desc" },
    where: { websiteId: website.id },
  });

  return db.websiteVersion.create({
    data: {
      contentJson: input.contentJson,
      createdById: input.createdById,
      name: input.name,
      themeJson: input.themeJson,
      updatedById: input.updatedById,
      versionNumber: (latest?.versionNumber ?? 0) + 1,
      websiteId: website.id,
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
    name?: string;
    themeJson?: Record<string, string>;
    updatedById: string;
    versionId: string;
  },
) {
  return db.websiteVersion.update({
    data: {
      ...(input.contentJson ? { contentJson: input.contentJson } : {}),
      ...(input.name ? { name: input.name } : {}),
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
