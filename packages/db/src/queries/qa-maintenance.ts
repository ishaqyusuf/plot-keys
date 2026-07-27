import { createHash } from "node:crypto";
import type { Db } from "../prisma";

export type QaPurgeCounts = {
  assets: number;
  assetBytes: number;
  companies: number;
  memberships: number;
  users: number;
};

function qaDomains() {
  const raw = process.env.EMAIL_QA_DOMAIN_ROUTES?.trim();
  if (!raw) return new Set<string>();
  return new Set(
    Object.keys(JSON.parse(raw) as Record<string, unknown>).map((domain) =>
      domain.toLowerCase(),
    ),
  );
}

export function configuredQaDomainForEmail(email: string) {
  const domain = email.toLowerCase().split("@").pop() ?? "";
  return qaDomains().has(domain) ? domain : null;
}

export async function assertQaCompanyIdentity(
  db: Db,
  input: { companyId: string; email: string },
) {
  const company = await db.company.findUnique({
    where: { id: input.companyId },
    select: { dataClassification: true, qaSourceDomain: true },
  });
  if (!company) throw new Error("Company not found.");
  const domain = input.email.toLowerCase().split("@").pop() ?? "";
  if (
    company.dataClassification === "qa" &&
    domain !== company.qaSourceDomain
  ) {
    throw new Error("Normal identities cannot join a QA company.");
  }
  if (company.dataClassification === "live" && domain.endsWith(".test")) {
    throw new Error("QA identities cannot join a live company.");
  }
}

export async function discoverQaCompanyCandidates(db: Db) {
  const companies = await db.company.findMany({
    where: {
      dataClassification: "live",
      deletedAt: null,
      qaPurgeStartedAt: null,
    },
    select: {
      id: true,
      name: true,
      slug: true,
      createdAt: true,
      memberships: {
        where: { role: "owner", status: "active" },
        select: { user: { select: { email: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return companies.flatMap((company) => {
    const qaSourceDomain = company.memberships
      .map((membership) => configuredQaDomainForEmail(membership.user.email))
      .find(Boolean);
    return qaSourceDomain
      ? [{ ...company, memberships: undefined, qaSourceDomain }]
      : [];
  });
}

export async function adoptQaCompanyCandidates(db: Db, companyIds: string[]) {
  const candidates = await discoverQaCompanyCandidates(db);
  const candidateMap = new Map(
    candidates.map((candidate) => [candidate.id, candidate]),
  );
  if (companyIds.some((id) => !candidateMap.has(id))) {
    throw new Error("A selected company no longer qualifies as QA.");
  }
  await db.$transaction(
    companyIds.map((id) =>
      db.company.update({
        where: { id, dataClassification: "live" },
        data: {
          dataClassification: "qa",
          qaMarkedAt: new Date(),
          qaSourceDomain: candidateMap.get(id)?.qaSourceDomain,
        },
      }),
    ),
  );
  return { adoptedCount: companyIds.length };
}

export async function previewQaPurge(db: Db) {
  const companies = await db.company.findMany({
    where: { dataClassification: "qa", deletedAt: null },
    select: {
      id: true,
      name: true,
      slug: true,
      qaSourceDomain: true,
      updatedAt: true,
      billingLineItems: {
        where: {
          status: "active",
          paidAt: { not: null },
          providerRef: { not: null },
        },
        select: { id: true, kind: true },
      },
      tenantDomains: {
        where: { deletedAt: null },
        select: {
          hostname: true,
          kind: true,
          status: true,
          vercelDomainName: true,
          vercelProjectKey: true,
        },
      },
      assets: {
        where: { status: { not: "deleted" } },
        select: {
          bucket: true,
          byteSize: true,
          key: true,
          provider: true,
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
  const companyIds = companies.map((company) => company.id);
  const [memberships, users] = companyIds.length
    ? await Promise.all([
        db.membership.count({ where: { companyId: { in: companyIds } } }),
        db.user.count({
          where: { memberships: { some: { companyId: { in: companyIds } } } },
        }),
      ])
    : [0, 0];
  const assets = companies.flatMap((company) =>
    company.assets.map((asset) => ({ ...asset, companyId: company.id })),
  );
  const blockers: Array<{
    category:
      | "purchased_domain"
      | "live_custom_domain"
      | "live_subscription"
      | "storage_credential_unavailable"
      | "hosting_credential_unavailable";
    companyId: string;
    companyName: string;
  }> = companies.flatMap((company) => {
    const paidDomain = company.billingLineItems.some(
      (item) => item.kind === "domain_addon",
    );
    const liveSubscription = company.billingLineItems.some(
      (item) => item.kind === "subscription",
    );
    const activeCustomDomain = company.tenantDomains.some(
      (domain) =>
        domain.kind.includes("custom_domain") && domain.status === "active",
    );
    return [
      ...(paidDomain
        ? [
            {
              category: "purchased_domain" as const,
              companyId: company.id,
              companyName: company.name,
            },
          ]
        : []),
      ...(activeCustomDomain && !paidDomain
        ? [
            {
              category: "live_custom_domain" as const,
              companyId: company.id,
              companyName: company.name,
            },
          ]
        : []),
      ...(liveSubscription
        ? [
            {
              category: "live_subscription" as const,
              companyId: company.id,
              companyName: company.name,
            },
          ]
        : []),
    ];
  });
  for (const company of companies) {
    if (
      company.assets.length > 0 &&
      !process.env.BLOB_READ_WRITE_TOKEN?.trim()
    ) {
      blockers.push({
        category: "storage_credential_unavailable",
        companyId: company.id,
        companyName: company.name,
      });
    }
    if (
      company.tenantDomains.some((domain) => domain.vercelDomainName) &&
      (!process.env.VERCEL_ACCESS_TOKEN?.trim() ||
        !process.env.VERCEL_TEAM_ID?.trim())
    ) {
      blockers.push({
        category: "hosting_credential_unavailable",
        companyId: company.id,
        companyName: company.name,
      });
    }
  }
  const fingerprint = createHash("sha256")
    .update(
      companies
        .map((company) => `${company.id}:${company.updatedAt.toISOString()}`)
        .join("|"),
    )
    .digest("hex");

  return {
    assets,
    blockers,
    counts: {
      assets: assets.length,
      assetBytes: assets.reduce(
        (total, asset) => total + (asset.byteSize ?? 0),
        0,
      ),
      companies: companies.length,
      memberships,
      users,
    } satisfies QaPurgeCounts,
    fingerprint,
    companies: companies.map(
      ({
        assets: _assets,
        billingLineItems: _billing,
        tenantDomains,
        updatedAt: _updatedAt,
        ...company
      }) => ({ ...company, tenantDomains }),
    ),
  };
}

export async function createQaPurgeRun(db: Db, actorUserId: string) {
  return db.qaPurgeRun.create({
    data: {
      activeKey: "global",
      requestedByUserId: actorUserId,
      status: "queued",
    },
  });
}

export async function getQaPurgeRun(db: Db, id: string) {
  return db.qaPurgeRun.findUnique({ where: { id } });
}

export async function beginQaPurge(db: Db, runId: string) {
  const preview = await previewQaPurge(db);
  if (preview.blockers.length) {
    await db.qaPurgeRun.update({
      where: { id: runId, status: "queued" },
      data: {
        activeKey: null,
        completedAt: new Date(),
        errorCategory: "live_provider_resource",
        status: "blocked",
      },
    });
    throw new Error("Live provider resources block QA deletion.");
  }
  const startedAt = new Date();
  await db.$transaction([
    db.qaPurgeRun.update({
      where: { id: runId, status: "queued" },
      data: { startedAt, status: "running" },
    }),
    db.company.updateMany({
      where: { id: { in: preview.companies.map((company) => company.id) } },
      data: { qaPurgeStartedAt: startedAt },
    }),
  ]);
  return preview;
}

export async function deleteQaCompany(db: Db, companyId: string) {
  const userIds = (
    await db.membership.findMany({
      where: { companyId },
      select: { userId: true },
    })
  ).map((membership) => membership.userId);
  await db.company.delete({
    where: {
      id: companyId,
      dataClassification: "qa",
      qaPurgeStartedAt: { not: null },
    },
  });
  await db.user.deleteMany({
    where: {
      id: { in: userIds },
      globalRole: { not: "platform_admin" },
      memberships: { none: {} },
    },
  });
}

export async function finishQaPurge(
  db: Db,
  input: {
    counts: QaPurgeCounts;
    errorCategory?: string;
    runId: string;
    status: "completed" | "failed" | "partially_completed";
  },
) {
  return db.qaPurgeRun.update({
    where: { id: input.runId },
    data: {
      activeKey: null,
      completedAt: new Date(),
      deletedCounts: input.counts,
      errorCategory: input.errorCategory,
      status: input.status,
    },
  });
}
