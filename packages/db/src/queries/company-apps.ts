import type { Db } from "../prisma";

type CompanyPlanTier = "starter" | "plus" | "pro";

export type CompanyAppsState = {
  enabledIds: string[];
  planTier: CompanyPlanTier;
};

export async function getInstalledAppKeys(
  db: Db,
  companyId: string,
): Promise<string[]> {
  const rows = await db.companyApp.findMany({
    where: { companyId },
    select: { appKey: true },
  });
  return rows.map((r) => r.appKey);
}

export async function getCompanyAppsState(
  db: Db,
  companyId: string,
): Promise<CompanyAppsState | null> {
  const company = await db.company.findFirst({
    select: {
      enabledApps: true,
      planTier: true,
    },
    where: {
      deletedAt: null,
      id: companyId,
    },
  });

  if (!company) {
    return null;
  }

  return {
    enabledIds: company.enabledApps ?? [],
    planTier: company.planTier ?? "starter",
  };
}

export async function setCompanyEnabledAppIds(
  db: Db,
  input: {
    companyId: string;
    enabledIds: readonly string[];
  },
) {
  await db.company.update({
    data: {
      enabledApps: Array.from(input.enabledIds),
    },
    where: { id: input.companyId },
  });
}

export async function installApp(
  db: Db,
  companyId: string,
  appKey: string,
): Promise<void> {
  await db.companyApp.upsert({
    where: {
      companyId_appKey: { companyId, appKey },
    },
    create: { companyId, appKey },
    update: {},
  });
}

export async function uninstallApp(
  db: Db,
  companyId: string,
  appKey: string,
): Promise<void> {
  await db.companyApp.deleteMany({
    where: { companyId, appKey },
  });
}
