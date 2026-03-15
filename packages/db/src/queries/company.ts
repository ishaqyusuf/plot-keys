import type { Db } from "../prisma";

export async function findCompanyBySlug(db: Db, slug: string) {
  return db.company.findFirst({
    where: {
      deletedAt: null,
      slug,
    },
  });
}
