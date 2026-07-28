import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let overviewRouter: typeof import("./overview.route")["overviewRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ overviewRouter } = await import("./overview.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(authenticated = true) {
  const agentCount = mock(async () => 2);
  const appointmentCount = mock(async () => 3);
  const leadCount = mock(async () => 4);
  const propertyCount = mock(async () => 5);
  const tenantDomainFindMany = mock(async () => [
    {
      apexDomain: "plotkeys.com",
      hostname: "acme.plotkeys.com",
      id: "domain-1",
      kind: "sitefront_subdomain",
      status: "active",
    },
  ]);
  const websiteVersionFindFirst = mock(async () => ({
    id: "version-1",
    publishedAt: new Date("2026-07-01T00:00:00.000Z"),
    status: "published",
    versionNumber: 2,
  }));
  const db = {
    agent: { count: agentCount },
    appointment: { count: appointmentCount },
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    lead: { count: leadCount },
    property: { count: propertyCount },
    tenantDomain: { findMany: tenantDomainFindMany },
    websiteVersion: { findFirst: websiteVersionFindFirst },
  };

  return {
    agentCount,
    appointmentCount,
    context: {
      auth: authenticated
        ? {
            activeMembership: {
              companyId: "company-1",
              role: "staff",
              workRole: "operations",
            },
            session: {
              user: {
                email: "staff@example.com",
                id: "user-1",
                name: "Test Staff",
              },
            },
          }
        : { activeMembership: null, session: null },
      databaseProvider: "postgres",
      db: {
        db,
        provider: "postgres",
        status: {
          available: true,
          message: null,
          provider: "postgres",
        },
      },
      headers: new Headers(),
    } as unknown as TRPCContext,
    leadCount,
    propertyCount,
    tenantDomainFindMany,
    websiteVersionFindFirst,
  };
}

describe("overview router", () => {
  test("requires an active membership", async () => {
    const { context } = contextFor(false);
    const caller = overviewRouter.createCaller(context);

    await expect(caller.summary()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("returns the active company's dashboard summary", async () => {
    const {
      agentCount,
      appointmentCount,
      context,
      leadCount,
      propertyCount,
      tenantDomainFindMany,
      websiteVersionFindFirst,
    } = contextFor();
    const caller = overviewRouter.createCaller(context);

    await expect(caller.summary()).resolves.toMatchObject({
      counts: {
        agentCount: 2,
        appointmentCount: 3,
        leadCount: 4,
        propertyCount: 5,
      },
      domainProvisioningConfigured: expect.any(Boolean),
      domainStatuses: [{ id: "domain-1" }],
      publishedVersion: { id: "version-1", versionNumber: 2 },
    });

    for (const count of [
      agentCount,
      appointmentCount,
      leadCount,
      propertyCount,
    ]) {
      expect(count.mock.calls[0]?.[0]).toMatchObject({
        where: { companyId: "company-1" },
      });
    }
    expect(tenantDomainFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
    expect(websiteVersionFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        website: {
          companyId: "company-1",
          deletedAt: null,
        },
      },
    });
  });
});
