import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

type Role = "admin" | "staff";

const originalDatabaseUrl = process.env.DATABASE_URL;
let teamRouter: typeof import("./team.route")["teamRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ teamRouter } = await import("./team.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(role: Role) {
  let company = {
    id: "company-1",
    logoUrl: null as string | null,
    market: "Lagos",
    name: "Plot Co",
    planStatus: "active",
    planTier: "starter",
    slug: "plot-co",
  };
  const findFirst = mock(async () => company);
  const update = mock(
    async (query: { data: Partial<typeof company>; where: { id: string } }) => {
      company = { ...company, ...query.data };
      return company;
    },
  );
  const db = {
    company: {
      findFirst,
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
      update,
    },
  };

  return {
    context: {
      auth: {
        activeMembership: {
          companyId: "company-1",
          role,
          workRole: "operations",
        },
        session: {
          user: {
            email: "user@example.com",
            id: "user-1",
            name: "Test User",
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
    findFirst,
    update,
  };
}

describe("team settings", () => {
  test("returns the active team settings", async () => {
    const { context, findFirst } = contextFor("staff");
    const caller = teamRouter.createCaller(context);

    await expect(caller.current()).resolves.toEqual({
      id: "company-1",
      logoUrl: null,
      market: "Lagos",
      name: "Plot Co",
      planStatus: "active",
      planTier: "starter",
      slug: "plot-co",
    });
    expect(findFirst.mock.calls[0]?.[0]).toEqual({
      where: {
        deletedAt: null,
        id: "company-1",
      },
    });
  });

  test("requires an administrator to update team settings", async () => {
    const { context, update } = contextFor("staff");
    const caller = teamRouter.createCaller(context);

    await expect(caller.update({ name: "Updated Co" })).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("validates the canonical team name contract", async () => {
    const { context, update } = contextFor("admin");
    const caller = teamRouter.createCaller(context);

    await expect(caller.update({ name: "X" })).rejects.toMatchObject({
      code: "BAD_REQUEST",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("updates profile and logo through one team mutation", async () => {
    const { context, update } = contextFor("admin");
    const caller = teamRouter.createCaller(context);

    await expect(
      caller.update({
        logoUrl: "https://cdn.example.com/logo.png",
        market: "Abuja",
        name: "Updated Plot Co",
      }),
    ).resolves.toEqual({
      id: "company-1",
      logoUrl: "https://cdn.example.com/logo.png",
      market: "Abuja",
      name: "Updated Plot Co",
      planStatus: "active",
      planTier: "starter",
      slug: "plot-co",
    });
    expect(update.mock.calls[0]?.[0]).toEqual({
      data: {
        market: "Abuja",
        name: "Updated Plot Co",
      },
      where: { id: "company-1" },
    });
    expect(update.mock.calls[1]?.[0]).toEqual({
      data: {
        logoUrl: "https://cdn.example.com/logo.png",
      },
      where: { id: "company-1" },
    });
  });
});
