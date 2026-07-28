import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

type Role = "admin" | "staff";

const originalDatabaseUrl = process.env.DATABASE_URL;
let integrationsRouter: typeof import("./integrations.route")["integrationsRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ integrationsRouter } = await import("./integrations.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(role: Role) {
  const findUnique = mock(async () => ({
    calendlyUrl: null,
    companyId: "company-1",
    googleAnalyticsId: "G-123",
  }));
  const upsert = mock(async (query: unknown) => query);
  const db = {
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    companyIntegration: {
      findUnique,
      upsert,
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
    findUnique,
    upsert,
  };
}

describe("integrations router", () => {
  test("allows members to read the active company integration", async () => {
    const { context, findUnique } = contextFor("staff");
    const caller = integrationsRouter.createCaller(context);

    await expect(caller.get()).resolves.toMatchObject({
      companyId: "company-1",
      googleAnalyticsId: "G-123",
    });
    expect(findUnique.mock.calls[0]?.[0]).toEqual({
      where: { companyId: "company-1" },
    });
  });

  test("requires an administrator to update integrations", async () => {
    const { context, upsert } = contextFor("staff");
    const caller = integrationsRouter.createCaller(context);

    await expect(
      caller.update({ googleAnalyticsId: "G-456" }),
    ).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
    expect(upsert).not.toHaveBeenCalled();
  });

  test("upserts integration settings for the active company", async () => {
    const { context, upsert } = contextFor("admin");
    const caller = integrationsRouter.createCaller(context);

    await caller.update({
      calendlyUrl: null,
      facebookPixelId: "pixel-1",
      googleAnalyticsId: "G-456",
      whatsappPhone: null,
    });

    expect(upsert.mock.calls[0]?.[0]).toEqual({
      create: {
        calendlyUrl: null,
        companyId: "company-1",
        facebookPixelId: "pixel-1",
        googleAnalyticsId: "G-456",
        whatsappPhone: null,
      },
      update: {
        calendlyUrl: null,
        facebookPixelId: "pixel-1",
        googleAnalyticsId: "G-456",
        whatsappPhone: null,
      },
      where: { companyId: "company-1" },
    });
  });
});
