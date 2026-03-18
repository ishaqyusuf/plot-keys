import type { Db } from "../prisma";

export async function listAgentsForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number; featured?: boolean } = {},
) {
  return db.agent.findMany({
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "asc" }],
    take: options.limit ?? 20,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}
