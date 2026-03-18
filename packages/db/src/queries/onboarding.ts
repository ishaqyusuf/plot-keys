import { randomUUID } from "node:crypto";

import type { Db } from "../prisma";

export async function upsertTenantOnboarding(
  db: Db,
  input: {
    companyName: string;
    currentStep?: string;
    market?: string;
    subdomain: string;
    templateKey?: string;
    userId: string;
  },
) {
  return db.tenantOnboarding.upsert({
    create: {
      companyName: input.companyName.trim(),
      currentStep: input.currentStep ?? "market",
      id: randomUUID(),
      market: input.market?.trim() || null,
      subdomain: input.subdomain.trim().toLowerCase(),
      templateKey: input.templateKey ?? null,
      userId: input.userId,
    },
    update: {
      companyName: input.companyName.trim(),
      currentStep: input.currentStep ?? "market",
      ...(input.market !== undefined && { market: input.market.trim() || null }),
      subdomain: input.subdomain.trim().toLowerCase(),
      ...(input.templateKey !== undefined && { templateKey: input.templateKey }),
    },
    where: { userId: input.userId },
  });
}

export async function findTenantOnboardingByUserId(db: Db, userId: string) {
  return db.tenantOnboarding.findUnique({
    where: { userId },
  });
}

export async function completeTenantOnboarding(db: Db, userId: string) {
  return db.tenantOnboarding.updateMany({
    data: {
      completedAt: new Date(),
      currentStep: "done",
    },
    where: {
      completedAt: null,
      userId,
    },
  });
}

export async function createCompanyOnboardingBundle(
  db: Db,
  input: {
    apexDomain: string;
    companyName: string;
    createdById: string;
    dashboardHostname: string;
    initialSiteConfiguration: {
      contentJson: Record<string, string>;
      name: string;
      subdomain: string;
      templateKey: string;
      themeJson: Record<string, string>;
    };
    market: string;
    sitefrontHostname: string;
    subdomain: string;
  },
) {
  return db.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: {
        market: input.market,
        name: input.companyName,
        planStartedAt: new Date(),
        planStatus: "active",
        planTier: "starter",
        slug: input.subdomain,
      },
    });

    await tx.membership.create({
      data: {
        companyId: company.id,
        role: "owner",
        status: "active",
        userId: input.createdById,
      },
    });

    await tx.tenantDomain.createMany({
      data: [
        {
          apexDomain: input.apexDomain,
          companyId: company.id,
          hostname: input.sitefrontHostname,
          kind: "sitefront_subdomain",
          status: "pending",
          subdomainLabel: input.subdomain,
          vercelProjectKey: "sitefront",
        },
        {
          apexDomain: input.apexDomain,
          companyId: company.id,
          hostname: input.dashboardHostname,
          kind: "dashboard_subdomain",
          status: "pending",
          subdomainLabel: `dashboard.${input.subdomain}`,
          vercelProjectKey: "dashboard",
        },
      ],
    });

    return tx.siteConfiguration.create({
      data: {
        ...input.initialSiteConfiguration,
        companyId: company.id,
        createdById: input.createdById,
        publishedAt: new Date(),
        status: "published",
        updatedById: input.createdById,
      },
    });
  });
}
