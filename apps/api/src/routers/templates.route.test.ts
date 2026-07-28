import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let templatesRouter: typeof import("./templates.route")["templatesRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ templatesRouter } = await import("./templates.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(input?: {
  activeMembership?: boolean;
  db?: Record<string, unknown>;
  session?: boolean;
}): TRPCContext {
  const session = input?.session ?? true;
  const activeMembership = input?.activeMembership ?? true;

  return {
    auth: {
      activeMembership:
        session && activeMembership
          ? {
              companyId: "company-1",
              role: "staff",
              workRole: "marketing",
            }
          : null,
      session: session
        ? {
            user: {
              email: "builder@example.com",
              id: "user-1",
              name: "Test Builder",
            },
          }
        : null,
    },
    databaseProvider: "postgres",
    db: {
      db: input?.db ?? null,
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

describe("templates router", () => {
  test("requires authentication for the catalog", async () => {
    const caller = templatesRouter.createCaller(contextFor({ session: false }));

    await expect(caller.catalog()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("returns catalog usage from the shared database context", async () => {
    const groupBy = mock(async () => [
      { _count: { companyId: 3 }, templateKey: "template-1" },
    ]);
    const caller = templatesRouter.createCaller(
      contextFor({
        activeMembership: false,
        db: { siteConfiguration: { groupBy } },
      }),
    );

    const result = await caller.catalog();

    expect(
      result.find((template) => template.key === "template-1"),
    ).toMatchObject({ usageCount: 3 });
    expect(groupBy.mock.calls[0]?.[0]).toMatchObject({
      by: ["templateKey"],
      where: {
        deletedAt: null,
        status: { in: ["draft", "published"] },
      },
    });
  });

  test("lists licenses through the active company scope", async () => {
    const findMany = mock(async () => [
      {
        grantedAt: new Date("2026-07-01T00:00:00.000Z"),
        source: "free",
        templateKey: "template-1",
      },
    ]);
    const caller = templatesRouter.createCaller(
      contextFor({
        db: {
          company: {
            findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
          },
          tenantTemplateLicense: { findMany },
        },
      }),
    );

    await expect(caller.licenses()).resolves.toEqual([
      {
        grantedAt: new Date("2026-07-01T00:00:00.000Z"),
        source: "free",
        templateKey: "template-1",
      },
    ]);
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1", revokedAt: null },
    });
  });

  test("claims a starter template for the active company", async () => {
    const upsert = mock(async () => ({ id: "license-1" }));
    const caller = templatesRouter.createCaller(
      contextFor({
        db: {
          company: {
            findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
          },
          tenantTemplateLicense: { upsert },
        },
      }),
    );

    await expect(
      caller.claimFree({ templateKey: "template-1" }),
    ).resolves.toEqual({
      granted: true,
      templateKey: "template-1",
    });
    expect(upsert.mock.calls[0]?.[0]).toMatchObject({
      create: {
        companyId: "company-1",
        grantedById: "user-1",
        source: "free",
        templateKey: "template-1",
      },
    });
  });
});
