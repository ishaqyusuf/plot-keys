import type { Db } from "../client";

export async function grantStockImageLicense(
  db: Db,
  data: {
    companyId: string;
    imageId: string;
    providerRef?: string;
  },
) {
  return db.tenantStockImageLicense.upsert({
    create: {
      companyId: data.companyId,
      imageId: data.imageId,
      providerRef: data.providerRef,
    },
    update: {},
    where: {
      companyId_imageId: {
        companyId: data.companyId,
        imageId: data.imageId,
      },
    },
  });
}

export async function hasStockImageLicense(
  db: Db,
  companyId: string,
  imageId: string,
) {
  const license = await db.tenantStockImageLicense.findUnique({
    where: {
      companyId_imageId: { companyId, imageId },
    },
  });
  return license !== null;
}

export async function listStockImageLicensesForCompany(
  db: Db,
  companyId: string,
) {
  return db.tenantStockImageLicense.findMany({
    orderBy: { grantedAt: "desc" },
    where: { companyId },
  });
}
