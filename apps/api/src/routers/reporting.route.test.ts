import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let analyticsRouter: typeof import("./analytics.route")["analyticsRouter"];
let reportsRouter: typeof import("./reports.route")["reportsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ analyticsRouter } = await import("./analytics.route"));
  ({ reportsRouter } = await import("./reports.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(authenticated = true) {
  const analyticsCount = mock(async () => 0);
  const analyticsFindMany = mock(async () => []);
  const analyticsGroupBy = mock(async () => []);
  const appointmentCount = mock(async () => 0);
  const appointmentGroupBy = mock(async () => []);
  const customerCount = mock(async () => 0);
  const leadCount = mock(async () => 0);
  const leadGroupBy = mock(async () => []);
  const propertyCount = mock(async () => 0);
  const db = {
    agent: {
      findMany: mock(async () => []),
    },
    analyticsEvent: {
      count: analyticsCount,
      findMany: analyticsFindMany,
      groupBy: analyticsGroupBy,
    },
    appointment: {
      count: appointmentCount,
      groupBy: appointmentGroupBy,
    },
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    customer: {
      count: customerCount,
    },
    lead: {
      count: leadCount,
      groupBy: leadGroupBy,
    },
    property: {
      count: propertyCount,
      findMany: mock(async () => []),
    },
  };

  return {
    analyticsCount,
    analyticsFindMany,
    analyticsGroupBy,
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
                email: "user@example.com",
                id: "user-1",
                name: "Test User",
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
    customerCount,
    leadCount,
    leadGroupBy,
    propertyCount,
  };
}

function expectCompanyScope(mockFn: ReturnType<typeof mock>) {
  for (const [query] of mockFn.mock.calls) {
    expect(query).toMatchObject({
      where: {
        companyId: "company-1",
      },
    });
  }
}

describe("reporting routers", () => {
  test("requires membership for analytics", async () => {
    const { context } = contextFor(false);
    const caller = analyticsRouter.createCaller(context);

    await expect(caller.get()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("validates the report period contract", async () => {
    const { context } = contextFor();
    const caller = reportsRouter.createCaller(context);

    await expect(caller.get({ month: 13, year: 2026 })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
  });

  test("returns period reports scoped to the active company", async () => {
    const {
      appointmentCount,
      context,
      customerCount,
      leadCount,
      propertyCount,
    } = contextFor();
    const caller = reportsRouter.createCaller(context);

    await expect(caller.get({ month: 7, year: 2026 })).resolves.toMatchObject({
      agentReport: [],
      listingsReport: [],
      summary: {
        appointments: { completed: 0, total: 0 },
        customers: { new: 0 },
        leads: { closed: 0, new: 0, qualified: 0 },
        pageViews: 0,
        period: { month: 7, year: 2026 },
        properties: { new: 0, published: 0 },
      },
    });
    expectCompanyScope(appointmentCount);
    expectCompanyScope(customerCount);
    expectCompanyScope(leadCount);
    expectCompanyScope(propertyCount);
  });

  test("returns analytics scoped to the active company", async () => {
    const {
      analyticsCount,
      analyticsFindMany,
      analyticsGroupBy,
      context,
      leadGroupBy,
    } = contextFor();
    const caller = analyticsRouter.createCaller(context);

    await expect(caller.get()).resolves.toMatchObject({
      agentStats: [],
      byType: [],
      leadSources: [],
      pageViewsByDay: [],
      propertyViews: [],
      recentEvents: [],
      topPages: [],
      totalEvents: 0,
      trafficSources: [],
      uniqueVisitors: 0,
    });
    expectCompanyScope(analyticsCount);
    expectCompanyScope(analyticsFindMany);
    expectCompanyScope(analyticsGroupBy);
    expectCompanyScope(leadGroupBy);
  });
});
