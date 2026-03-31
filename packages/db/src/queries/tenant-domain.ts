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

/**
 * Creates a pair of custom-domain TenantDomain records (sitefront + dashboard)
 * for a company. The sitefront record uses the provided hostname; the dashboard
 * record prefixes it with "dashboard.".
 *
 * Returns the created sitefront domain record.
 */
export async function createCustomDomainPair(
  db: Db,
  input: {
    companyId: string;
    hostname: string;
    apexDomain: string;
  },
) {
  const dashboardHostname = `dashboard.${input.hostname}`;

  const [sitefrontDomain] = await db.$transaction([
    db.tenantDomain.create({
      data: {
        companyId: input.companyId,
        kind: "sitefront_custom_domain",
        status: "pending",
        hostname: input.hostname,
        apexDomain: input.apexDomain,
        vercelProjectKey: "sitefront",
      },
    }),
    db.tenantDomain.create({
      data: {
        companyId: input.companyId,
        kind: "dashboard_custom_domain",
        status: "pending",
        hostname: dashboardHostname,
        apexDomain: input.apexDomain,
        vercelProjectKey: "dashboard",
      },
    }),
  ]);

  return sitefrontDomain;
}

/**
 * Finds a non-deleted TenantDomain by hostname, regardless of status.
 * Used to check for hostname conflicts before creating custom domains.
 */
export async function findTenantDomainByHostname(
  db: Db,
  hostname: string,
) {
  return db.tenantDomain.findFirst({
    where: {
      hostname: hostname.toLowerCase(),
      deletedAt: null,
    },
    select: {
      id: true,
      companyId: true,
      hostname: true,
      status: true,
      kind: true,
    },
  });
}

/**
 * Returns custom-domain TenantDomain records for a company with their
 * verificationJson so DNS instructions can be rendered.
 */
export async function listCustomDomainsWithVerification(
  db: Db,
  companyId: string,
) {
  return db.tenantDomain.findMany({
    where: {
      companyId,
      deletedAt: null,
      kind: { in: ["sitefront_custom_domain", "dashboard_custom_domain"] },
    },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      hostname: true,
      kind: true,
      status: true,
      verificationJson: true,
      lastError: true,
      provisionedAt: true,
    },
  });
}

/**
 * Soft-deletes a custom domain and its paired dashboard domain.
 * Only allows deletion of custom domains (not subdomains).
 */
export async function removeCustomDomain(
  db: Db,
  input: {
    companyId: string;
    domainId: string;
  },
) {
  const domain = await db.tenantDomain.findFirst({
    where: {
      id: input.domainId,
      companyId: input.companyId,
      deletedAt: null,
      kind: { in: ["sitefront_custom_domain", "dashboard_custom_domain"] },
    },
  });

  if (!domain) {
    return null;
  }

  const now = new Date();

  // Soft-delete both the domain and its pair
  // If this is a sitefront domain, also delete dashboard.{hostname}
  // If this is a dashboard domain, also delete the sitefront pair
  const pairedHostname =
    domain.kind === "sitefront_custom_domain"
      ? `dashboard.${domain.hostname}`
      : domain.hostname.replace(/^dashboard\./, "");

  await db.$transaction([
    db.tenantDomain.update({
      where: { id: domain.id },
      data: { deletedAt: now, status: "detached" },
    }),
    db.tenantDomain.updateMany({
      where: {
        companyId: input.companyId,
        hostname: pairedHostname,
        deletedAt: null,
      },
      data: { deletedAt: now, status: "detached" },
    }),
  ]);

  return domain;
}
