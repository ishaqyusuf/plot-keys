import type { Db } from "../prisma";

export async function listFeaturedProperties(db: Db, companyId: string) {
  return db.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    where: {
      companyId,
      deletedAt: null,
      status: "active",
    },
  });
}

export async function listPropertiesForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number; featured?: boolean } = {},
) {
  return db.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: options.limit ?? 20,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}
