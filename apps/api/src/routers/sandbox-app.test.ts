import { afterAll, beforeAll, describe, expect, test } from "bun:test";
import type { TRPCContext } from "../context";

const originalDatabaseUrl = process.env.DATABASE_URL;
let sandboxAppRouter: typeof import("./sandbox-app")["sandboxAppRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ sandboxAppRouter } = await import("./sandbox-app"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(role?: "owner" | "platform_admin"): TRPCContext {
  const db = {
    $queryRaw: async () => [],
    company: {
      findUnique: async () => null,
    },
  };

  return {
    auth: role
      ? {
          activeMembership: {
            companyId: "company-test",
            role,
            workRole: "operations",
          },
          session: {
            user: {
              email: "admin@example.com",
              id: "user-test",
              name: "Test Admin",
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
  } as unknown as TRPCContext;
}

describe("sandbox app authorization", () => {
  test("rejects anonymous authoring callers", async () => {
    const caller = sandboxAppRouter.createCaller(contextFor());

    await expect(caller.templateSandbox.catalog()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("rejects authenticated non-platform administrators", async () => {
    const caller = sandboxAppRouter.createCaller(contextFor("owner"));

    await expect(caller.templateSandbox.catalog()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });

  test("allows platform administrators to access authoring contracts", async () => {
    const caller = sandboxAppRouter.createCaller(contextFor("platform_admin"));

    await expect(caller.templateSandbox.catalog()).resolves.toBeArray();
  });

  test("lets anonymous callers read only share previews", async () => {
    const caller = sandboxAppRouter.createCaller(contextFor());

    await expect(
      caller.templateSandbox.preview({
        mode: "draft",
        pathname: "/",
        shareId: "missing",
      }),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
    });
  });
});
