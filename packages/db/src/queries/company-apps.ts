import { createPrismaClient, type Db } from "../prisma";

type CompanyPlanTier = "starter" | "plus" | "pro";

export type CompanyAppsState = {
  enabledIds: string[];
  planTier: CompanyPlanTier;
};

export type CompanyAppsStateResult =
  | { data: CompanyAppsState; ok: true }
  | { ok: false; reason: "company-not-found" | "database-unavailable" };

export type CompanyAppMutationResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" };

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
  companyId: string,
): Promise<CompanyAppsStateResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

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
    return { ok: false, reason: "company-not-found" };
  }

  return {
    data: {
      enabledIds: company.enabledApps ?? [],
      planTier: company.planTier ?? "starter",
    },
    ok: true,
  };
}

export async function setCompanyEnabledAppIds(input: {
  companyId: string;
  enabledIds: readonly string[];
}): Promise<{ ok: true } | { ok: false; reason: "database-unavailable" }> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await db.company.update({
    data: {
      enabledApps: Array.from(input.enabledIds),
    },
    where: { id: input.companyId },
  });

  return { ok: true };
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

export async function installCompanyApp(input: {
  appKey: string;
  companyId: string;
}): Promise<CompanyAppMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await installApp(db, input.companyId, input.appKey);

  return { ok: true };
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

export async function uninstallCompanyApp(input: {
  appKey: string;
  companyId: string;
}): Promise<CompanyAppMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await uninstallApp(db, input.companyId, input.appKey);

  return { ok: true };
}
