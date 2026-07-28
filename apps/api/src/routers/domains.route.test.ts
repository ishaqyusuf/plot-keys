import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  VERCEL_API_TOKEN: process.env.VERCEL_API_TOKEN,
  VERCEL_DASHBOARD_PROJECT_ID: process.env.VERCEL_DASHBOARD_PROJECT_ID,
  VERCEL_SITEFRONT_PROJECT_ID: process.env.VERCEL_SITEFRONT_PROJECT_ID,
};
let domainsRouter: typeof import("./domains.route")["domainsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  delete process.env.VERCEL_API_TOKEN;
  delete process.env.VERCEL_DASHBOARD_PROJECT_ID;
  delete process.env.VERCEL_SITEFRONT_PROJECT_ID;
  ({ domainsRouter } = await import("./domains.route"));
});

afterAll(() => {
  for (const [key, value] of Object.entries(originalEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
});

type DomainRecord = {
  companyId?: string;
  deletedAt?: Date | null;
  hostname: string;
  id: string;
  kind:
    | "dashboard_custom_domain"
    | "dashboard_subdomain"
    | "sitefront_custom_domain"
    | "sitefront_subdomain";
  lastError: string | null;
  provisionedAt: Date | null;
  status: "active" | "detached" | "failed" | "pending" | "provisioning";
  verificationJson?: unknown;
};

function contextFor(input?: {
  authenticated?: boolean;
  domains?: DomainRecord[];
  removableDomain?: DomainRecord | null;
}) {
  const domains = input?.domains ?? [];
  const tenantFindMany = mock(async () => domains);
  const tenantFindFirst = mock(
    async (query: { where?: { hostname?: string; id?: string } }) => {
      if (query.where?.id) {
        return input?.removableDomain ?? null;
      }
      return null;
    },
  );
  const tenantCreate = mock(
    async (query: {
      data: {
        companyId: string;
        hostname: string;
        kind: DomainRecord["kind"];
        status: DomainRecord["status"];
      };
    }) => ({
      ...query.data,
      id:
        query.data.kind === "sitefront_custom_domain"
          ? "site-domain-1"
          : "dashboard-domain-1",
      lastError: null,
      provisionedAt: null,
    }),
  );
  const tenantUpdate = mock(async (query: unknown) => query);
  const tenantUpdateMany = mock(async (query: unknown) => query);
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    company: {
      findFirst: mock(async () => ({ id: "company-1", name: "Plot Co" })),
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    tenantDomain: {
      create: tenantCreate,
      findFirst: tenantFindFirst,
      findMany: tenantFindMany,
      update: tenantUpdate,
      updateMany: tenantUpdateMany,
    },
  };
  const authenticated = input?.authenticated ?? true;

  return {
    context: {
      auth: authenticated
        ? {
            activeMembership: {
              companyId: "company-1",
              role: "owner",
              workRole: "operations",
            },
            session: {
              user: {
                email: "owner@example.com",
                id: "user-1",
                name: "Test Owner",
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
    tenantCreate,
    tenantFindFirst,
    tenantFindMany,
    tenantUpdate,
    tenantUpdateMany,
  };
}

describe("domains router", () => {
  test("requires an active membership", async () => {
    const { context } = contextFor({ authenticated: false });
    const caller = domainsRouter.createCaller(context);

    await expect(caller.status()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("validates domain search input before provider access", async () => {
    const { context } = contextFor();
    const caller = domainsRouter.createCaller(context);

    await expect(caller.search({ label: "" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  test("returns derived status for the active company", async () => {
    const { context, tenantFindMany } = contextFor({
      domains: [
        {
          hostname: "example.com",
          id: "domain-1",
          kind: "sitefront_custom_domain",
          lastError: "Verification pending",
          provisionedAt: null,
          status: "failed",
        },
      ],
    });
    const caller = domainsRouter.createCaller(context);

    await expect(caller.status()).resolves.toMatchObject({
      allProvisioned: false,
      companyName: "Plot Co",
      domainProvisioningConfigured: false,
      hasFailure: true,
    });
    expect(tenantFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
  });

  test("returns DNS instructions only for sitefront custom domains", async () => {
    const { context } = contextFor({
      domains: [
        {
          hostname: "example.com",
          id: "site-domain-1",
          kind: "sitefront_custom_domain",
          lastError: null,
          provisionedAt: null,
          status: "pending",
          verificationJson: [
            {
              domain: "_verify.example.com",
              type: "TXT",
              value: "verify-me",
            },
          ],
        },
        {
          hostname: "dashboard.example.com",
          id: "dashboard-domain-1",
          kind: "dashboard_custom_domain",
          lastError: null,
          provisionedAt: null,
          status: "pending",
        },
      ],
    });
    const caller = domainsRouter.createCaller(context);

    const result = await caller.dnsInstructions();

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      hostname: "example.com",
      id: "site-domain-1",
      status: "pending",
    });
    expect(
      result[0]?.instructions.records.some((item) => item.type === "TXT"),
    ).toBe(true);
  });

  test("normalizes a hostname and creates its paired domains", async () => {
    const { context, tenantCreate, tenantFindFirst } = contextFor();
    const caller = domainsRouter.createCaller(context);

    await expect(
      caller.connect({ hostname: "HTTPS://Homes.Example.com/path" }),
    ).resolves.toMatchObject({
      domain: {
        hostname: "homes.example.com",
        id: "site-domain-1",
        status: "pending",
      },
    });
    expect(tenantFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: { hostname: "homes.example.com" },
    });
    expect(tenantFindFirst.mock.calls[1]?.[0]).toMatchObject({
      where: { hostname: "dashboard.homes.example.com" },
    });
    expect(tenantCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        apexDomain: "example.com",
        companyId: "company-1",
        hostname: "homes.example.com",
        kind: "sitefront_custom_domain",
      },
    });
    expect(tenantCreate.mock.calls[1]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        hostname: "dashboard.homes.example.com",
        kind: "dashboard_custom_domain",
      },
    });
  });

  test("removes a custom domain pair through the active company scope", async () => {
    const removableDomain: DomainRecord = {
      companyId: "company-1",
      hostname: "example.com",
      id: "00000000-0000-0000-0000-000000000001",
      kind: "sitefront_custom_domain",
      lastError: null,
      provisionedAt: null,
      status: "active",
    };
    const { context, tenantFindFirst, tenantUpdate, tenantUpdateMany } =
      contextFor({ removableDomain });
    const caller = domainsRouter.createCaller(context);

    await expect(
      caller.remove({ domainId: removableDomain.id }),
    ).resolves.toEqual({
      hostname: "example.com",
      removed: true,
    });
    expect(tenantFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        id: removableDomain.id,
      },
    });
    expect(tenantUpdate).toHaveBeenCalledTimes(1);
    expect(tenantUpdateMany).toHaveBeenCalledTimes(1);
  });

  test("rejects sync when provisioning is not configured", async () => {
    const { context } = contextFor();
    const caller = domainsRouter.createCaller(context);

    await expect(caller.sync()).rejects.toMatchObject({
      code: "PRECONDITION_FAILED",
    });
  });
});
