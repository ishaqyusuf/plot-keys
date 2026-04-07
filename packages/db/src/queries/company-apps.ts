import type { Db } from "../prisma";

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
