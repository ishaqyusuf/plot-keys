import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let leaveRequestsRouter: typeof import("./leave-requests.route")["leaveRequestsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ leaveRequestsRouter } = await import("./leave-requests.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const request = {
    employee: { id: "employee-1", name: "Ada Employee", title: "Manager" },
    employeeId: "employee-1",
    id: "leave-1",
    leaveType: "annual",
    status: "pending",
  };
  const count = mock(async () => 1);
  const create = mock(async (query: unknown) => query);
  const employeeFindFirst = mock(async () => ({ id: "employee-1" }));
  const findMany = mock(async () => [request]);
  const groupBy = mock(async () => [{ _count: 1, status: "pending" }]);
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
    leaveRequest: {
      count,
      create,
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
    create,
    employeeFindFirst,
    findMany,
    groupBy,
    updateMany,
  };
}

describe("leave requests router", () => {
  test("lists leave requests through the active company scope", async () => {
    const { context, count, findMany } = contextFor();
    const caller = leaveRequestsRouter.createCaller(context);

    await expect(
      caller.list({ q: "Ada", size: 25, status: "pending" }),
    ).resolves.toMatchObject({
      data: [{ id: "leave-1" }],
      meta: { count: 1, size: 25 },
    });
    expect(count.mock.calls[0]?.[0]).toMatchObject({
      where: {
        employee: {
          companyId: "company-1",
          deletedAt: null,
        },
        status: "pending",
      },
    });
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        employee: {
          companyId: "company-1",
          deletedAt: null,
        },
        status: "pending",
      },
    });
  });

  test("returns tenant-scoped leave status totals", async () => {
    const { context, groupBy } = contextFor();
    const caller = leaveRequestsRouter.createCaller(context);

    await expect(caller.stats()).resolves.toEqual({
      approved: 0,
      cancelled: 0,
      pending: 1,
      rejected: 0,
      total: 1,
    });
    expect(groupBy.mock.calls[0]?.[0]).toMatchObject({
      where: {
        employee: {
          companyId: "company-1",
          deletedAt: null,
        },
      },
    });
  });

  test("creates leave only for an active-company employee", async () => {
    const { context, create, employeeFindFirst } = contextFor();
    const caller = leaveRequestsRouter.createCaller(context);

    await caller.create({
      employeeId: "employee-1",
      endDate: "2026-08-05",
      leaveType: "annual",
      startDate: "2026-08-01",
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
        employeeId: "employee-1",
        leaveType: "annual",
      },
    });
  });

  test("records approval through the employee company scope", async () => {
    const { context, updateMany } = contextFor();
    const caller = leaveRequestsRouter.createCaller(context);

    await expect(
      caller.updateStatus({
        leaveRequestId: "leave-1",
        status: "approved",
      }),
    ).resolves.toEqual({
      leaveRequestId: "leave-1",
      status: "approved",
    });
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      data: {
        approvedById: "user-1",
        status: "approved",
      },
      where: {
        employee: {
          companyId: "company-1",
          deletedAt: null,
        },
        id: "leave-1",
      },
    });
  });

  test("updates unique selected requests through one scoped write", async () => {
    const { context, updateMany } = contextFor();
    updateMany.mockImplementationOnce(async () => ({ count: 2 }));
    const caller = leaveRequestsRouter.createCaller(context);

    await expect(
      caller.updateManyStatus({
        leaveRequestIds: ["leave-1", "leave-1", "leave-2"],
        status: "rejected",
      }),
    ).resolves.toEqual({
      leaveRequestIds: ["leave-1", "leave-2"],
      status: "rejected",
    });
    expect(updateMany.mock.calls[0]?.[0]).toEqual({
      data: { status: "rejected" },
      where: {
        employee: {
          companyId: "company-1",
          deletedAt: null,
        },
        id: { in: ["leave-1", "leave-2"] },
      },
    });
  });
});
