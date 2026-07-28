import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let employeesRouter: typeof import("./employees.route")["employeesRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ employeesRouter } = await import("./employees.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const employee = {
    companyId: "company-1",
    department: { id: "department-1", name: "Sales" },
    deletedAt: null,
    id: "employee-1",
    name: "Ada Employee",
    status: "active",
  };
  const count = mock(async () => 1);
  const findFirst = mock(async () => employee);
  const findMany = mock(async () => [employee]);
  const groupBy = mock(async () => [{ _count: 1, status: "active" }]);
  const updateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    employee: {
      count,
      findFirst,
      findMany,
      groupBy,
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
    findFirst,
    findMany,
    groupBy,
    updateMany,
  };
}

describe("employees router", () => {
  test("lists employees through the active company scope", async () => {
    const { context, count, findMany } = contextFor();
    const caller = employeesRouter.createCaller(context);

    await expect(
      caller.list({ q: "Ada", size: 25, status: "active" }),
    ).resolves.toMatchObject({
      data: [{ id: "employee-1", name: "Ada Employee" }],
      meta: { count: 1, size: 25 },
    });
    expect(count.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        status: "active",
      },
    });
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        status: "active",
      },
    });
  });

  test("returns tenant-scoped employee status totals", async () => {
    const { context, groupBy } = contextFor();
    const caller = employeesRouter.createCaller(context);

    await expect(caller.stats()).resolves.toEqual({
      active: 1,
      on_leave: 0,
      suspended: 0,
      terminated: 0,
      total: 1,
    });
    expect(groupBy.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
  });

  test("updates employee status through a company-qualified write", async () => {
    const { context, updateMany } = contextFor();
    const caller = employeesRouter.createCaller(context);

    await expect(
      caller.updateStatus({
        employeeId: "employee-1",
        status: "on_leave",
      }),
    ).resolves.toMatchObject({
      id: "employee-1",
    });
    expect(updateMany.mock.calls[0]?.[0]).toEqual({
      data: { status: "on_leave" },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "employee-1",
      },
    });
  });

  test("soft deletes unique employees through company predicates", async () => {
    const { context, updateMany } = contextFor();
    const caller = employeesRouter.createCaller(context);

    await expect(
      caller.deleteMany({
        employeeIds: ["employee-1", "employee-1", "employee-2"],
      }),
    ).resolves.toEqual({
      ids: ["employee-1", "employee-2"],
    });
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "employee-1",
      },
    });
    expect(updateMany.mock.calls[1]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "employee-2",
      },
    });
  });
});
