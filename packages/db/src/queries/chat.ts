import type { Db } from "../prisma";
import { listAgentsForCompany } from "./agent";
import { listFeaturedProperties } from "./property";

export type TenantChatContext = {
  agents: Awaited<ReturnType<typeof listAgentsForCompany>>["data"];
  businessSummary: string | null;
  company: {
    id: string;
    market: string | null;
    name: string;
  };
  properties: Awaited<ReturnType<typeof listFeaturedProperties>>;
};

export async function getTenantChatContext(
  db: Db,
  input: { subdomain: string },
): Promise<TenantChatContext | null> {
  const company = await db.company.findFirst({
    select: {
      id: true,
      market: true,
      name: true,
    },
    where: { deletedAt: null, slug: input.subdomain },
  });

  if (!company) return null;

  const [properties, agentsPage, onboarding] = await Promise.all([
    listFeaturedProperties(db, company.id).catch(() => []),
    listAgentsForCompany(db, company.id, { limit: 10 }).catch(() => ({
      data: [],
    })),
    db.tenantOnboarding
      .findFirst({
        select: { businessSummary: true },
        where: {
          user: {
            memberships: {
              some: { companyId: company.id },
            },
          },
        },
      })
      .catch(() => null),
  ]);

  return {
    agents: agentsPage.data,
    businessSummary: onboarding?.businessSummary ?? null,
    company,
    properties,
  };
}
