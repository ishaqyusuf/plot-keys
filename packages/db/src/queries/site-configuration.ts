import type { Db } from "../prisma";

export async function findSiteConfigurationByIdForCompany(
  db: Db,
  input: {
    companyId: string;
    configId: string;
  },
) {
  return db.siteConfiguration.findFirst({
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.configId,
    },
  });
}

export async function findLatestSiteConfigurationForCompany(
  db: Db,
  companyId: string,
) {
  return db.siteConfiguration.findFirst({
    orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
    where: {
      companyId,
      deletedAt: null,
    },
  });
}

export async function findLatestDraftForTemplate(
  db: Db,
  input: {
    companyId: string;
    templateKey: string;
  },
) {
  return db.siteConfiguration.findFirst({
    orderBy: {
      updatedAt: "desc",
    },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      status: "draft",
      templateKey: input.templateKey,
    },
  });
}

export async function createSiteConfiguration(
  db: Db,
  input: {
    companyId: string;
    contentJson: Record<string, string>;
    createdById: string;
    name: string;
    publishedAt?: Date;
    status?: "archived" | "draft" | "published";
    subdomain?: string | null;
    templateKey: string;
    themeJson: Record<string, string>;
    updatedById: string;
  },
) {
  const siteConfig = await db.siteConfiguration.create({
    data: {
      companyId: input.companyId,
      contentJson: input.contentJson,
      createdById: input.createdById,
      name: input.name,
      publishedAt: input.publishedAt,
      status: input.status,
      subdomain: input.subdomain,
      templateKey: input.templateKey,
      themeJson: input.themeJson,
      updatedById: input.updatedById,
    },
  });

  // Phase 2 dual-write: create a matching draft WebsiteVersion
  const website = await db.website.findFirst({
    where: { companyId: input.companyId, deletedAt: null },
  });
  if (website) {
    const latest = await db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      where: { websiteId: website.id },
    });

    await db.websiteVersion.create({
      data: {
        contentJson: input.contentJson,
        createdById: input.createdById,
        legacyConfigId: siteConfig.id,
        name: input.name,
        themeJson: input.themeJson,
        updatedById: input.updatedById,
        versionNumber: (latest?.versionNumber ?? 0) + 1,
        websiteId: website.id,
      },
    });

    // Update the website template key if it changed
    if (website.templateKey !== input.templateKey) {
      await db.website.update({
        data: { templateKey: input.templateKey },
        where: { id: website.id },
      });
    }
  }

  return siteConfig;
}

export async function updateSiteConfigurationThemeField(
  db: Db,
  input: {
    configId: string;
    currentTheme: Record<string, string>;
    themeKey: string;
    updatedById: string;
    value: string;
    version: number;
  },
) {
  const newTheme = {
    ...input.currentTheme,
    [input.themeKey]: input.value,
  };

  const result = await db.siteConfiguration.update({
    data: {
      themeJson: newTheme,
      updatedById: input.updatedById,
      version: input.version + 1,
    },
    where: { id: input.configId },
  });

  // Phase 2 dual-write: mirror theme update to draft WebsiteVersion
  const website = await db.website.findFirst({
    where: { companyId: result.companyId, deletedAt: null },
  });
  if (website) {
    const draft = await db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      where: { status: "draft", websiteId: website.id },
    });
    if (draft) {
      await db.websiteVersion.update({
        data: { themeJson: newTheme, updatedById: input.updatedById },
        where: { id: draft.id },
      });
    }
  }

  return result;
}

export async function updateSiteConfigurationContentField(
  db: Db,
  input: {
    configId: string;
    contentKey: string;
    currentContent: Record<string, string>;
    updatedById: string;
    value: string;
    version: number;
  },
) {
  const newContent = {
    ...input.currentContent,
    [input.contentKey]: input.value,
  };

  const result = await db.siteConfiguration.update({
    where: { id: input.configId },
    data: {
      contentJson: newContent,
      updatedById: input.updatedById,
      version: input.version + 1,
    },
  });

  // Phase 2 dual-write: mirror content update to draft WebsiteVersion
  const website = await db.website.findFirst({
    where: { companyId: result.companyId, deletedAt: null },
  });
  if (website) {
    const draft = await db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      where: { status: "draft", websiteId: website.id },
    });
    if (draft) {
      await db.websiteVersion.update({
        data: { contentJson: newContent, updatedById: input.updatedById },
        where: { id: draft.id },
      });
    }
  }

  return result;
}

/**
 * Returns the count of distinct companies using each template key.
 * Only published or draft configurations are counted (not archived).
 * Used to show template uniqueness / popularity on template picker cards.
 */
export async function countCompaniesByTemplateKey(
  db: Db,
): Promise<Record<string, number>> {
  const rows = await db.siteConfiguration.groupBy({
    _count: { companyId: true },
    by: ["templateKey"],
    where: {
      deletedAt: null,
      status: { in: ["draft", "published"] },
    },
  });

  return Object.fromEntries(
    rows.map((row) => [row.templateKey, row._count.companyId]),
  );
}

/**
 * Replaces the full `themeJson` with a serialized `TemplateConfig` object.
 * Use this for structured design updates (e.g. changing the style preset,
 * accent color, or named image assignments) rather than per-key updates.
 * Increments the version number.
 */
export async function updateSiteConfigurationTheme(
  db: Db,
  input: {
    configId: string;
    themeJson: Record<string, string>;
    updatedById: string;
    version: number;
  },
) {
  const result = await db.siteConfiguration.update({
    data: {
      themeJson: input.themeJson,
      updatedById: input.updatedById,
      version: input.version + 1,
    },
    where: { id: input.configId },
  });

  // Phase 2 dual-write: mirror full theme update to draft WebsiteVersion
  const website = await db.website.findFirst({
    where: { companyId: result.companyId, deletedAt: null },
  });
  if (website) {
    const draft = await db.websiteVersion.findFirst({
      orderBy: { versionNumber: "desc" },
      where: { status: "draft", websiteId: website.id },
    });
    if (draft) {
      await db.websiteVersion.update({
        data: { themeJson: input.themeJson, updatedById: input.updatedById },
        where: { id: draft.id },
      });
    }
  }

  return result;
}

export async function publishSiteConfiguration(
  db: Db,
  input: {
    companyId: string;
    configId: string;
    currentName: string;
    nextName?: string;
    updatedById: string;
    version: number;
  },
) {
  await db.$transaction(async (tx) => {
    await tx.siteConfiguration.updateMany({
      data: {
        status: "draft",
        updatedById: input.updatedById,
      },
      where: {
        companyId: input.companyId,
        deletedAt: null,
        status: "published",
      },
    });

    const published = await tx.siteConfiguration.update({
      where: { id: input.configId },
      data: {
        name: input.nextName || input.currentName,
        publishedAt: new Date(),
        status: "published",
        updatedById: input.updatedById,
        version: input.version + 1,
      },
    });

    // Phase 2 dual-write: publish the current draft WebsiteVersion
    const website = await tx.website.findFirst({
      where: { companyId: input.companyId, deletedAt: null },
    });

    if (website) {
      // Archive old published version
      await tx.websiteVersion.updateMany({
        data: { status: "archived", updatedById: input.updatedById },
        where: { status: "published", websiteId: website.id },
      });

      // Find or create the draft version to publish
      let draft = await tx.websiteVersion.findFirst({
        orderBy: { versionNumber: "desc" },
        where: { status: "draft", websiteId: website.id },
      });

      if (!draft) {
        const latest = await tx.websiteVersion.findFirst({
          orderBy: { versionNumber: "desc" },
          where: { websiteId: website.id },
        });

        draft = await tx.websiteVersion.create({
          data: {
            contentJson: published.contentJson ?? {},
            createdById: input.updatedById,
            legacyConfigId: published.id,
            name: published.name,
            themeJson: published.themeJson ?? {},
            updatedById: input.updatedById,
            versionNumber: (latest?.versionNumber ?? 0) + 1,
            websiteId: website.id,
          },
        });
      }

      // Promote draft to published
      await tx.websiteVersion.update({
        data: {
          contentJson: published.contentJson ?? {},
          legacyConfigId: published.id,
          name: published.name,
          publishedAt: new Date(),
          status: "published",
          themeJson: published.themeJson ?? {},
          updatedById: input.updatedById,
        },
        where: { id: draft.id },
      });

      await tx.website.update({
        data: { publishedVersionId: draft.id },
        where: { id: website.id },
      });
    }
  });
}
