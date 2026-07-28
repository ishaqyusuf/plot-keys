import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let stockImagesRouter: typeof import("./stock-images.route")["stockImagesRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ stockImagesRouter } = await import("./stock-images.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(db: Record<string, unknown>): TRPCContext {
  return {
    auth: {
      activeMembership: {
        companyId: "company-1",
        role: "staff",
        workRole: "marketing",
      },
      session: {
        user: {
          email: "builder@example.com",
          id: "user-1",
          name: "Test Builder",
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
  } as unknown as TRPCContext;
}

function companyDb() {
  return {
    findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
  };
}

describe("stock images router", () => {
  test("lists licenses through the active company scope", async () => {
    const findMany = mock(async () => [{ imageId: "free-exterior-1" }]);
    const caller = stockImagesRouter.createCaller(
      contextFor({
        company: companyDb(),
        tenantStockImageLicense: { findMany },
      }),
    );

    await expect(caller.licenses()).resolves.toMatchObject([
      { imageId: "free-exterior-1" },
    ]);
    expect(findMany.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
  });

  test("grants free images without creating a billing item", async () => {
    const billingCreate = mock(async () => ({ id: "billing-1" }));
    const licenseUpsert = mock(async () => ({ id: "license-1" }));
    const caller = stockImagesRouter.createCaller(
      contextFor({
        billingLineItem: { create: billingCreate },
        company: companyDb(),
        tenantStockImageLicense: { upsert: licenseUpsert },
      }),
    );

    await expect(
      caller.purchase({ imageId: "free-exterior-1" }),
    ).resolves.toEqual({
      granted: true,
      imageId: "free-exterior-1",
    });
    expect(billingCreate).not.toHaveBeenCalled();
    expect(licenseUpsert.mock.calls[0]?.[0]).toMatchObject({
      create: {
        companyId: "company-1",
        imageId: "free-exterior-1",
      },
    });
  });

  test("records billing before granting a standard image", async () => {
    const billingCreate = mock(async () => ({ id: "billing-1" }));
    const findUnique = mock(async () => null);
    const licenseUpsert = mock(async () => ({ id: "license-1" }));
    const caller = stockImagesRouter.createCaller(
      contextFor({
        billingLineItem: { create: billingCreate },
        company: companyDb(),
        tenantStockImageLicense: {
          findUnique,
          upsert: licenseUpsert,
        },
      }),
    );

    await expect(caller.purchase({ imageId: "std-hero-1" })).resolves.toEqual({
      granted: true,
      imageId: "std-hero-1",
    });
    expect(findUnique.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId_imageId: {
          companyId: "company-1",
          imageId: "std-hero-1",
        },
      },
    });
    expect(billingCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        kind: "stock_image",
        status: "active",
      },
    });
    expect(licenseUpsert).toHaveBeenCalledTimes(1);
  });
});
