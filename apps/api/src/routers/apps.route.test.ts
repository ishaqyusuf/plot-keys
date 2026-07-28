import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

type Role = "admin" | "owner" | "staff";

const originalDatabaseUrl = process.env.DATABASE_URL;
let appsRouter: typeof import("./apps.route")["appsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ appsRouter } = await import("./apps.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(input?: {
  enabledApps?: string[];
  planTier?: "starter" | "plus" | "pro";
  role?: Role;
}) {
  const findFirst = mock(async () => ({
    enabledApps: input?.enabledApps ?? ["analytics"],
    id: "company-1",
    planTier: input?.planTier ?? "starter",
  }));
  const findUnique = mock(async () => ({ qaPurgeStartedAt: null }));
  const update = mock(async () => ({ id: "company-1" }));
  const db = {
    company: {
      findFirst,
      findUnique,
      update,
    },
  };
  const role = input?.role;

  return {
    context: {
      auth: role
        ? {
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
    findFirst,
    findUnique,
    update,
  };
}

describe("apps router", () => {
  test("requires an active membership", async () => {
    const { context } = contextFor();
    const caller = appsRouter.createCaller(context);

    await expect(caller.get()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("loads app state for the active company", async () => {
    const { context, findFirst, findUnique } = contextFor({
      enabledApps: ["analytics", "blog"],
      planTier: "pro",
      role: "staff",
    });
    const caller = appsRouter.createCaller(context);

    await expect(caller.get()).resolves.toEqual({
      enabledIds: ["analytics", "blog"],
      planTier: "pro",
    });
    expect(findUnique.mock.calls[0]?.[0]).toEqual({
      select: { qaPurgeStartedAt: true },
      where: { id: "company-1" },
    });
    expect(findFirst.mock.calls[0]?.[0]).toEqual({
      select: {
        enabledApps: true,
        planTier: true,
      },
      where: {
        deletedAt: null,
        id: "company-1",
      },
    });
  });

  test("requires an administrator to change enabled apps", async () => {
    const { context, update } = contextFor({ role: "staff" });
    const caller = appsRouter.createCaller(context);

    await expect(
      caller.setEnabled({ appId: "blog", enabled: true }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("enforces app plan gates", async () => {
    const { context, update } = contextFor({
      planTier: "starter",
      role: "admin",
    });
    const caller = appsRouter.createCaller(context);

    await expect(
      caller.setEnabled({ appId: "crm", enabled: true }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(update).not.toHaveBeenCalled();
  });

  test("updates enabled apps through the active company scope", async () => {
    const { context, update } = contextFor({
      enabledApps: ["analytics"],
      role: "owner",
    });
    const caller = appsRouter.createCaller(context);

    await expect(
      caller.setEnabled({ appId: "blog", enabled: true }),
    ).resolves.toEqual({
      appId: "blog",
      enabled: true,
    });
    expect(update.mock.calls[0]?.[0]).toEqual({
      data: {
        enabledApps: ["analytics", "blog"],
      },
      where: { id: "company-1" },
    });
  });
});
