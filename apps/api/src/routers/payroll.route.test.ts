import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let payrollRouter: typeof import("./payroll.route")["payrollRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ payrollRouter } = await import("./payroll.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const entry = {
    employee: { id: "employee-1", name: "Ada Employee", title: "Manager" },
    employeeId: "employee-1",
    grossAmount: 200_000,
    id: "payroll-1",
    netAmount: 180_000,
    periodMonth: 7,
    periodYear: 2026,
    status: "pending",
  };
  const count = mock(async () => 1);
  const create = mock(async (query: unknown) => query);
  const employeeFindFirst = mock(async () => ({ id: "employee-1" }));
  const findMany = mock(async () => [entry]);
  const updateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    employee: {
      findFirst: employeeFindFirst,
    },
    payrollEntry: {
      count,
      create,
      findMany,
      updateMany,
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
    count,
    create,
    employeeFindFirst,
    findMany,
    updateMany,
  };
}

describe("payroll router", () => {
  test("lists payroll through company and period predicates", async () => {
    const { context, count, findMany } = contextFor();
    const caller = payrollRouter.createCaller(context);

    await expect(
      caller.list({
        periodMonth: 7,
        periodYear: 2026,
        q: "Ada",
        size: 25,
      }),
    ).resolves.toMatchObject({
      data: [{ id: "payroll-1" }],
      meta: { count: 1, size: 25 },
    });
    expect(count.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        periodMonth: 7,
        periodYear: 2026,
      },
    });
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        periodMonth: 7,
        periodYear: 2026,
      },
    });
  });

  test("creates payroll only for an active-company employee", async () => {
    const { context, create, employeeFindFirst } = contextFor();
    const caller = payrollRouter.createCaller(context);

    await caller.create({
      employeeId: "employee-1",
      grossAmount: 200_000,
      netAmount: 180_000,
      periodMonth: 7,
      periodYear: 2026,
    });

    expect(employeeFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "employee-1",
      },
    });
    expect(create.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        employeeId: "employee-1",
        periodMonth: 7,
        periodYear: 2026,
      },
    });
  });

  test("returns a company-scoped payroll summary", async () => {
    const { context, findMany } = contextFor();
    const caller = payrollRouter.createCaller(context);

    await expect(
      caller.summary({ periodMonth: 7, periodYear: 2026 }),
    ).resolves.toEqual({
      paidCount: 0,
      pendingCount: 1,
      totalEntries: 1,
      totalGross: 200_000,
      totalNet: 180_000,
    });
    expect(findMany.mock.calls[0]?.[0]).toEqual({
      select: {
        grossAmount: true,
        netAmount: true,
        status: true,
      },
      where: {
        companyId: "company-1",
        periodMonth: 7,
        periodYear: 2026,
      },
    });
  });

  test("marks unique payroll entries paid through company predicates", async () => {
    const { context, updateMany } = contextFor();
    const caller = payrollRouter.createCaller(context);

    await expect(
      caller.markManyPaid({
        payrollEntryIds: ["payroll-1", "payroll-1", "payroll-2"],
      }),
    ).resolves.toEqual({
      ids: ["payroll-1", "payroll-2"],
    });
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      data: { status: "paid" },
      where: {
        companyId: "company-1",
        id: "payroll-1",
      },
    });
    expect(updateMany.mock.calls[1]?.[0]).toMatchObject({
      data: { status: "paid" },
      where: {
        companyId: "company-1",
        id: "payroll-2",
      },
    });
  });

  test("lists available periods through the active company scope", async () => {
    const { context, findMany } = contextFor();
    const caller = payrollRouter.createCaller(context);

    await caller.periods();

    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      distinct: ["periodYear", "periodMonth"],
      where: { companyId: "company-1" },
    });
  });
});
