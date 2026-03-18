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
  return db.siteConfiguration.create({
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
  return db.siteConfiguration.update({
    data: {
      themeJson: {
        ...input.currentTheme,
        [input.themeKey]: input.value,
      },
      updatedById: input.updatedById,
      version: input.version + 1,
    },
    where: { id: input.configId },
  });
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
  return db.siteConfiguration.update({
    where: {
      id: input.configId,
    },
    data: {
      contentJson: {
        ...input.currentContent,
        [input.contentKey]: input.value,
      },
      updatedById: input.updatedById,
      version: input.version + 1,
    },
  });
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
  return db.siteConfiguration.update({
    data: {
      themeJson: input.themeJson,
      updatedById: input.updatedById,
      version: input.version + 1,
    },
    where: { id: input.configId },
  });
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
  await db.$transaction([
    db.siteConfiguration.updateMany({
      data: {
        status: "draft",
        updatedById: input.updatedById,
      },
      where: {
        companyId: input.companyId,
        deletedAt: null,
        status: "published",
      },
    }),
    db.siteConfiguration.update({
      where: {
        id: input.configId,
      },
      data: {
        name: input.nextName || input.currentName,
        publishedAt: new Date(),
        status: "published",
        updatedById: input.updatedById,
        version: input.version + 1,
      },
    }),
  ]);
}
