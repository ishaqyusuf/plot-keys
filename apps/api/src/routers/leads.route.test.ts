import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let leadsRouter: typeof import("./leads.route")["leadsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ leadsRouter } = await import("./leads.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const leadCount = mock(async () => 1);
  const customerCreate = mock(async () => ({ id: "customer-1" }));
  const leadFindFirst = mock(async () => ({
    companyId: "company-1",
    email: "lead@example.com",
    id: "lead-1",
    name: "Lead Person",
    phone: "08000000000",
    status: "qualified",
  }));
  const leadFindMany = mock(async (query: { select?: { id: boolean } }) =>
    query.select
      ? [{ id: "lead-1" }, { id: "lead-2" }]
      : [
          {
            email: "lead@example.com",
            id: "lead-1",
            name: "Lead Person",
            status: "new",
          },
        ],
  );
  const leadGroupBy = mock(async () => [{ _count: 1, status: "new" }]);
  const leadUpdateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    customer: {
      create: customerCreate,
    },
    lead: {
      count: leadCount,
      findFirst: leadFindFirst,
      findMany: leadFindMany,
      groupBy: leadGroupBy,
      updateMany: leadUpdateMany,
    },
  };

  return {
    context: {
      auth: {
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
      },
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
    customerCreate,
    leadCount,
    leadFindFirst,
    leadFindMany,
    leadGroupBy,
    leadUpdateMany,
  };
}

describe("leads router", () => {
  test("lists leads through the active company scope", async () => {
    const { context, leadCount, leadFindMany } = contextFor();
    const caller = leadsRouter.createCaller(context);

    await expect(caller.list({ q: "Lead", size: 25 })).resolves.toMatchObject({
      data: [{ id: "lead-1" }],
      meta: { count: 1, size: 25 },
    });
    expect(leadCount.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
    expect(leadFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
  });

  test("returns tenant-scoped status totals", async () => {
    const { context, leadGroupBy } = contextFor();
    const caller = leadsRouter.createCaller(context);

    await expect(caller.stats()).resolves.toEqual({
      closed: 0,
      contacted: 0,
      new: 1,
      qualified: 0,
      total: 1,
    });
    expect(leadGroupBy.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
  });

  test("updates one lead through a company-qualified write", async () => {
    const { context, leadUpdateMany } = contextFor();
    const caller = leadsRouter.createCaller(context);

    await expect(
      caller.updateStatus({
        leadId: "lead-1",
        status: "contacted",
      }),
    ).resolves.toEqual({
      leadId: "lead-1",
      status: "contacted",
    });
    expect(leadUpdateMany.mock.calls[0]?.[0]).toEqual({
      data: {
        notes: undefined,
        status: "contacted",
      },
      where: {
        companyId: "company-1",
        id: "lead-1",
      },
    });
  });

  test("validates selected leads before a scoped bulk update", async () => {
    const { context, leadFindMany, leadUpdateMany } = contextFor();
    const caller = leadsRouter.createCaller(context);

    await expect(
      caller.updateManyStatus({
        leadIds: ["lead-1", "lead-1", "lead-2"],
        status: "closed",
      }),
    ).resolves.toEqual({
      leadIds: ["lead-1", "lead-2"],
      status: "closed",
    });
    expect(leadFindMany.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        id: { in: ["lead-1", "lead-2"] },
      },
    });
    expect(leadUpdateMany.mock.calls[0]?.[0]).toEqual({
      data: { status: "closed" },
      where: {
        companyId: "company-1",
        id: { in: ["lead-1", "lead-2"] },
      },
    });
  });

  test("converts a tenant lead and qualifies it through a scoped write", async () => {
    const { context, customerCreate, leadFindFirst, leadUpdateMany } =
      contextFor();
    const caller = leadsRouter.createCaller(context);

    await expect(
      caller.convertToCustomer({ leadId: "lead-1" }),
    ).resolves.toEqual({
      customerId: "customer-1",
      leadId: "lead-1",
      status: "qualified",
    });
    expect(leadFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        id: "lead-1",
      },
    });
    expect(customerCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        sourceLeadId: "lead-1",
      },
    });
    expect(leadUpdateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        id: "lead-1",
      },
    });
  });
});
