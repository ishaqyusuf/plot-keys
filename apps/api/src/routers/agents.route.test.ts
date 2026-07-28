import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let agentsRouter: typeof import("./agents.route")["agentsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ agentsRouter } = await import("./agents.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const agent = {
    companyId: "company-1",
    deletedAt: null,
    displayOrder: 0,
    featured: false,
    id: "agent-1",
    name: "Ada Agent",
    title: "Sales Agent",
  };
  const count = mock(async () => 1);
  const create = mock(async (query: unknown) => query);
  const findFirst = mock(async () => agent);
  const findMany = mock(async () => [agent]);
  const updateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    agent: {
      count,
      create,
      findFirst,
      findMany,
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
    findFirst,
    findMany,
    updateMany,
  };
}

describe("agents router", () => {
  test("lists agents through the active company scope", async () => {
    const { context, count, findMany } = contextFor();
    const caller = agentsRouter.createCaller(context);

    await expect(caller.list({ q: "Ada", size: 25 })).resolves.toMatchObject({
      data: [{ id: "agent-1", name: "Ada Agent" }],
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

  test("loads agent details through the active company scope", async () => {
    const { context, findFirst } = contextFor();
    const caller = agentsRouter.createCaller(context);

    await expect(caller.get({ agentId: "agent-1" })).resolves.toMatchObject({
      id: "agent-1",
      name: "Ada Agent",
    });
    expect(findFirst.mock.calls[0]?.[0]).toEqual({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "agent-1",
      },
    });
  });

  test("creates agents for the active company", async () => {
    const { context, create } = contextFor();
    const caller = agentsRouter.createCaller(context);

    await caller.create({ name: "New Agent" });

    expect(create.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        featured: false,
        name: "New Agent",
      },
    });
  });

  test("updates agents through a company-qualified write", async () => {
    const { context, updateMany } = contextFor();
    const caller = agentsRouter.createCaller(context);

    await caller.update({
      agentId: "agent-1",
      name: "Updated Agent",
    });

    expect(updateMany.mock.calls[0]?.[0]).toEqual({
      data: { name: "Updated Agent" },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "agent-1",
      },
    });
  });

  test("toggles featured state through the active company scope", async () => {
    const { context, findFirst, updateMany } = contextFor();
    const caller = agentsRouter.createCaller(context);

    await expect(
      caller.toggleFeatured({ agentId: "agent-1" }),
    ).resolves.toEqual({
      agentId: "agent-1",
      featured: true,
    });
    expect(findFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "agent-1",
      },
    });
    expect(updateMany.mock.calls[0]?.[0]).toEqual({
      data: { featured: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "agent-1",
      },
    });
  });

  test("soft deletes unique selected agents through company predicates", async () => {
    const { context, updateMany } = contextFor();
    const caller = agentsRouter.createCaller(context);

    await expect(
      caller.deleteMany({
        agentIds: ["agent-1", "agent-1", "agent-2"],
      }),
    ).resolves.toEqual({
      ids: ["agent-1", "agent-2"],
    });
    expect(updateMany).toHaveBeenCalledTimes(2);
    expect(updateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "agent-1",
      },
    });
    expect(updateMany.mock.calls[1]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "agent-2",
      },
    });
  });
});
