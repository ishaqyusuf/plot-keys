import type { Db } from "../prisma";

/** Returns all active (non-revoked) template licenses for a company. */
export async function findTemplateLicensesForCompany(
  db: Db,
  companyId: string,
) {
  return db.tenantTemplateLicense.findMany({
    orderBy: { grantedAt: "asc" },
    where: { companyId, revokedAt: null },
  });
}

/** Returns the set of template keys the company is currently licensed to use. */
export async function findLicensedTemplateKeys(
  db: Db,
  companyId: string,
): Promise<Set<string>> {
  const licenses = await db.tenantTemplateLicense.findMany({
    select: { templateKey: true },
    where: { companyId, revokedAt: null },
  });
  return new Set(licenses.map((l) => l.templateKey));
}

/** Checks whether a company holds an active license for a specific template key. */
export async function hasTemplateLicense(
  db: Db,
  companyId: string,
  templateKey: string,
): Promise<boolean> {
  const count = await db.tenantTemplateLicense.count({
    where: { companyId, revokedAt: null, templateKey },
  });
  return count > 0;
}

/**
 * Grants a template license to a company.
 * Safe to call multiple times — uses upsert on the compound unique key.
 */
export async function grantTemplateLicense(
  db: Db,
  input: {
    companyId: string;
    grantedById?: string | null;
    source: "free" | "plan_included" | "purchased" | "admin_granted";
    templateKey: string;
  },
) {
  return db.tenantTemplateLicense.upsert({
    create: {
      companyId: input.companyId,
      grantedById: input.grantedById,
      source: input.source,
      templateKey: input.templateKey,
    },
    update: {
      grantedById: input.grantedById,
      revokedAt: null, // re-activate if previously revoked
    },
    where: {
      companyId_templateKey_source: {
        companyId: input.companyId,
        source: input.source,
        templateKey: input.templateKey,
      },
    },
  });
}

/** Revokes a specific license record by setting revokedAt. */
export async function revokeTemplateLicense(
  db: Db,
  input: {
    companyId: string;
    source: "free" | "plan_included" | "purchased" | "admin_granted";
    templateKey: string;
  },
) {
  return db.tenantTemplateLicense.updateMany({
    data: { revokedAt: new Date() },
    where: {
      companyId: input.companyId,
      revokedAt: null,
      source: input.source,
      templateKey: input.templateKey,
    },
  });
}

/**
 * Syncs plan-included template licenses for a company based on their current plan tier.
 * Grants licenses for all templates in the allowed set and revokes those no longer covered.
 */
export async function syncPlanIncludedLicenses(
  db: Db,
  companyId: string,
  allowedTemplateKeys: string[],
) {
  const existing = await db.tenantTemplateLicense.findMany({
    where: { companyId, revokedAt: null, source: "plan_included" },
  });

  const existingKeys = new Set(existing.map((l) => l.templateKey));
  const allowedSet = new Set(allowedTemplateKeys);

  const toGrant = allowedTemplateKeys.filter((k) => !existingKeys.has(k));
  const toRevoke = existing
    .filter((l) => !allowedSet.has(l.templateKey))
    .map((l) => l.id);

  await db.$transaction([
    ...toGrant.map((templateKey) =>
      db.tenantTemplateLicense.create({
        data: { companyId, source: "plan_included", templateKey },
      }),
    ),
    ...(toRevoke.length > 0
      ? [
          db.tenantTemplateLicense.updateMany({
            data: { revokedAt: new Date() },
            where: { id: { in: toRevoke } },
          }),
        ]
      : []),
  ]);
}
