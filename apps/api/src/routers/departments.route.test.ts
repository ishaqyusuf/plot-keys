import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let departmentsRouter: typeof import("./departments.route")["departmentsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ departmentsRouter } = await import("./departments.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const department = {
    _count: { employees: 2 },
    companyId: "company-1",
    deletedAt: null,
    id: "department-1",
    name: "Sales",
  };
  const count = mock(async () => 1);
  const create = mock(async (query: unknown) => query);
  const findMany = mock(async () => [department]);
  const updateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    department: {
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
    findMany,
    updateMany,
  };
}

describe("departments router", () => {
  test("lists departments through the active company scope", async () => {
    const { context, count, findMany } = contextFor();
    const caller = departmentsRouter.createCaller(context);

    await expect(caller.list({ q: "Sales", size: 25 })).resolves.toMatchObject({
      data: [{ id: "department-1", name: "Sales" }],
      meta: { count: 1, size: 25 },
    });
    expect(count.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
  });

  test("creates departments for the active company", async () => {
    const { context, create } = contextFor();
    const caller = departmentsRouter.createCaller(context);

    await caller.create({
      description: "Revenue team",
      name: "Sales",
    });

    expect(create.mock.calls[0]?.[0]).toEqual({
      data: {
        companyId: "company-1",
        description: "Revenue team",
        name: "Sales",
      },
    });
  });

  test("soft deletes unique departments through company predicates", async () => {
    const { context, updateMany } = contextFor();
    const caller = departmentsRouter.createCaller(context);

    await expect(
      caller.deleteMany({
        departmentIds: ["department-1", "department-1", "department-2"],
      }),
    ).resolves.toEqual({
      ids: ["department-1", "department-2"],
    });
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "department-1",
      },
    });
    expect(updateMany.mock.calls[1]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "department-2",
      },
    });
  });
});
