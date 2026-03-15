import type { Db } from "../prisma";

export async function findCompanyBySlug(db: Db, slug: string) {
  return db.company.findFirst({
    where: {
      deletedAt: null,
      slug,
    },
  });
}

export async function findCompanyById(db: Db, id: string) {
  return db.company.findFirst({
    where: {
      deletedAt: null,
      id,
    },
  });
}

export async function listTemplateUsageCounts(db: Db) {
  const records = await db.siteConfiguration.findMany({
    distinct: ["companyId", "templateKey"],
    select: {
      companyId: true,
      templateKey: true,
    },
    where: {
      deletedAt: null,
    },
  });

  return records.reduce<Record<string, number>>((counts, record) => {
    counts[record.templateKey] = (counts[record.templateKey] ?? 0) + 1;
    return counts;
  }, {});
}
