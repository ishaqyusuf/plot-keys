import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let appointmentsRouter: typeof import("./appointments.route")["appointmentsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ appointmentsRouter } = await import("./appointments.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const count = mock(async () => 1);
  const create = mock(async (query: unknown) => query);
  const deleteMany = mock(async () => ({ count: 1 }));
  const findMany = mock(async () => [
    {
      email: "visitor@example.com",
      id: "00000000-0000-0000-0000-000000000001",
      name: "Visitor",
      scheduledAt: new Date("2026-07-29T10:00:00.000Z"),
      status: "pending",
    },
  ]);
  const groupBy = mock(async () => [{ _count: 1, status: "pending" }]);
  const updateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    appointment: {
      count,
      create,
      deleteMany,
      findMany,
      groupBy,
      updateMany,
    },
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
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
    deleteMany,
    findMany,
    groupBy,
    updateMany,
  };
}

describe("appointments router", () => {
  test("lists appointments through the active company scope", async () => {
    const { context, count, findMany } = contextFor();
    const caller = appointmentsRouter.createCaller(context);

    await expect(
      caller.list({ q: "Visitor", size: 25 }),
    ).resolves.toMatchObject({
      data: [{ name: "Visitor" }],
      meta: { count: 1, size: 25 },
    });
    expect(count.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
  });

  test("creates appointments for the active company", async () => {
    const { context, create } = contextFor();
    const caller = appointmentsRouter.createCaller(context);

    await caller.create({
      email: "visitor@example.com",
      name: "Visitor",
      scheduledAt: "2026-07-29T10:00:00.000Z",
    });

    expect(create.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        email: "visitor@example.com",
        name: "Visitor",
        scheduledAt: new Date("2026-07-29T10:00:00.000Z"),
      },
    });
  });

  test("updates status through an appointment and company predicate", async () => {
    const { context, updateMany } = contextFor();
    const caller = appointmentsRouter.createCaller(context);
    const appointmentId = "00000000-0000-0000-0000-000000000001";

    await expect(
      caller.updateStatus({
        appointmentId,
        status: "confirmed",
      }),
    ).resolves.toEqual({
      appointmentId,
      status: "confirmed",
    });
    expect(updateMany.mock.calls[0]?.[0]).toEqual({
      data: {
        notes: undefined,
        status: "confirmed",
      },
      where: {
        companyId: "company-1",
        id: appointmentId,
      },
    });
  });

  test("deletes unique selected appointments through company predicates", async () => {
    const { context, deleteMany } = contextFor();
    const caller = appointmentsRouter.createCaller(context);
    const firstId = "00000000-0000-0000-0000-000000000001";
    const secondId = "00000000-0000-0000-0000-000000000002";

    await expect(
      caller.deleteMany({
        appointmentIds: [firstId, firstId, secondId],
      }),
    ).resolves.toEqual({
      ids: [firstId, secondId],
    });
    expect(deleteMany).toHaveBeenCalledTimes(2);
    expect(deleteMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        id: firstId,
      },
    });
    expect(deleteMany.mock.calls[1]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        id: secondId,
      },
    });
  });
});
