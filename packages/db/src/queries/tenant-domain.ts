import type { Db } from "../prisma";

/**
 * Resolves a tenant company from a fully-qualified hostname.
 *
 * Used by dashboard and tenant-site host resolution to map any registered
 * tenant hostname, including:
 *   - `{slug}.plotkeys.com`
 *   - `dashboard.{slug}.plotkeys.com`
 *   - `custom-domain.com`
 *   - `dashboard.custom-domain.com`
 *
 * Returns null when no matching active domain is found.
 */
export async function resolveTenantByHostname(
  db: Db,
  hostname: string,
): Promise<{
  companyId: string;
  companySlug: string;
  hostname: string;
} | null> {
  const normalizedHostname = hostname.toLowerCase().replace(/:\d+$/, "");

  const tenantDomain = await db.tenantDomain.findFirst({
    include: {
      company: { select: { deletedAt: true, id: true, slug: true } },
    },
    where: {
      deletedAt: null,
      hostname: normalizedHostname,
      status: "active",
    },
  });

  if (tenantDomain && !tenantDomain.company.deletedAt) {
    return {
      companyId: tenantDomain.company.id,
      companySlug: tenantDomain.company.slug,
      hostname: tenantDomain.hostname,
    };
  }

  return null;
}

/**
 * Returns all tenant domain records for a company (any status, not deleted).
 * Used to surface domain provisioning status in the dashboard.
 */
export async function listTenantDomainsForCompany(db: Db, companyId: string) {
  return db.tenantDomain.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      hostname: true,
      id: true,
      kind: true,
      lastError: true,
      provisionedAt: true,
      status: true,
    },
    where: { companyId, deletedAt: null },
  });
}

export async function listSyncableTenantDomains(db: Db, companyId: string) {
  return db.tenantDomain.findMany({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      companyId,
      deletedAt: null,
      status: {
        in: ["failed", "pending", "provisioning"],
      },
    },
  });
}

export async function markTenantDomainProvisioning(
  db: Db,
  input: {
    domainId: string;
  },
) {
  return db.tenantDomain.update({
    where: {
      id: input.domainId,
    },
    data: {
      lastError: null,
      status: "provisioning",
    },
  });
}

export async function updateTenantDomainSyncResult(
  db: Db,
  input: {
    domainId: string;
    lastError: string | null;
    provisionedAt: Date | null;
    status: "active" | "detached" | "failed" | "pending" | "provisioning";
    vercelDomainName: string | null;
    verificationJson?: unknown;
  },
) {
  return db.tenantDomain.update({
    where: {
      id: input.domainId,
    },
    data: {
      lastError: input.lastError,
      provisionedAt: input.provisionedAt,
      status: input.status,
      verificationJson: input.verificationJson ?? undefined,
      vercelDomainName: input.vercelDomainName,
    },
  });
}

export async function markTenantDomainFailed(
  db: Db,
  input: {
    domainId: string;
    message: string;
  },
) {
  return db.tenantDomain.update({
    where: {
      id: input.domainId,
    },
    data: {
      lastError: input.message,
      status: "failed",
    },
  });
}
