import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let aiCreditsRouter: typeof import("./ai-credits.route")["aiCreditsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ aiCreditsRouter } = await import("./ai-credits.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const billingCreate = mock(async () => ({ id: "billing-1" }));
  const ledgerAggregate = mock(async () => ({ _sum: { amount: 42 } }));
  const ledgerCreate = mock(async () => ({ id: "ledger-1" }));
  const usageAggregate = mock(async () => ({
    _sum: { creditsUsed: 8 },
  }));
  const usageFindMany = mock(async () => []);
  const usageGroupBy = mock(async () => [
    {
      _count: 2,
      _sum: { creditsUsed: 8 },
      feature: "smart_fill",
    },
  ]);
  const db = {
    aiCreditLedger: {
      aggregate: ledgerAggregate,
      create: ledgerCreate,
    },
    aiUsageLog: {
      aggregate: usageAggregate,
      findMany: usageFindMany,
      groupBy: usageGroupBy,
    },
    billingLineItem: {
      create: billingCreate,
    },
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
  };

  return {
    billingCreate,
    context: {
      auth: {
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
    ledgerAggregate,
    ledgerCreate,
    usageAggregate,
    usageFindMany,
    usageGroupBy,
  };
}

describe("AI Credits router", () => {
  test("returns tenant-scoped balance and usage", async () => {
    const {
      context,
      ledgerAggregate,
      usageAggregate,
      usageFindMany,
      usageGroupBy,
    } = contextFor();
    const caller = aiCreditsRouter.createCaller(context);

    await expect(caller.get()).resolves.toEqual({
      balance: 42,
      byFeature: [
        {
          count: 2,
          creditsUsed: 8,
          feature: "smart_fill",
        },
      ],
      recentLogs: [],
      totalCreditsUsed: 8,
    });
    expect(ledgerAggregate.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
    expect(usageAggregate.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
    expect(usageGroupBy.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
    expect(usageFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
  });

  test("records the top-up billing item before granting credits", async () => {
    const { billingCreate, context, ledgerCreate } = contextFor();
    const caller = aiCreditsRouter.createCaller(context);

    await expect(caller.purchase()).resolves.toEqual({ credited: 100 });
    expect(billingCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        amountMinorUnits: 500_000,
        companyId: "company-1",
        currency: "NGN",
        kind: "ai_credits",
        meta: { credits: 100 },
        status: "active",
      },
    });
    expect(ledgerCreate.mock.calls[0]?.[0]).toEqual({
      data: {
        amount: 100,
        companyId: "company-1",
        description: "Top-up: 100 credits",
        reason: "top_up",
        referenceId: "billing-1",
      },
    });
  });
});
