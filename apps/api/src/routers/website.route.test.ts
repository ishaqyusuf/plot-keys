import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let websiteRouter: typeof import("./website.route")["websiteRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ websiteRouter } = await import("./website.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor(
  db: Record<string, unknown>,
  authenticated = true,
): TRPCContext {
  return {
    auth: authenticated
      ? {
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

function membershipCompany() {
  return {
    findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
  };
}

describe("website router", () => {
  test("requires an active membership", async () => {
    const caller = websiteRouter.createCaller(
      contextFor({ company: membershipCompany() }, false),
    );

    await expect(caller.activeDraft()).rejects.toMatchObject({
      code: "UNAUTHORIZED",
    });
  });

  test("loads the active draft through the active company scope", async () => {
    const websiteFindFirst = mock(async () => ({
      id: "website-1",
      templateKey: "template-1",
    }));
    const versionFindFirst = mock(async () => ({
      contentJson: { "hero.title": "Welcome" },
      createdAt: new Date("2026-07-01T00:00:00.000Z"),
      id: "version-1",
      legacyConfigId: null,
      name: "Draft",
      status: "draft",
      themeJson: {},
      updatedAt: new Date("2026-07-02T00:00:00.000Z"),
      versionNumber: 2,
    }));
    const caller = websiteRouter.createCaller(
      contextFor({
        company: membershipCompany(),
        website: { findFirst: websiteFindFirst },
        websiteVersion: { findFirst: versionFindFirst },
      }),
    );

    await expect(caller.activeDraft()).resolves.toMatchObject({
      id: "version-1",
      templateKey: "template-1",
      websiteId: "website-1",
    });
    expect(websiteFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1", deletedAt: null },
    });
    expect(versionFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: { status: "draft", websiteId: "website-1" },
    });
  });

  test("scopes live preview hostname and company lookups", async () => {
    const tenantDomainFindFirst = mock(async () => null);
    const companyFindFirst = mock(async () => ({
      id: "company-1",
      market: null,
      name: "Acme",
      slug: "acme",
    }));
    const caller = websiteRouter.createCaller(
      contextFor({
        company: {
          ...membershipCompany(),
          findFirst: companyFindFirst,
        },
        tenantDomain: { findFirst: tenantDomainFindFirst },
      }),
    );

    await expect(
      caller.preview({
        hostname: "preview.example.com",
        subdomain: "another-company",
      }),
    ).resolves.toEqual({ status: "company-not-found" });
    expect(tenantDomainFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        hostname: "preview.example.com",
      },
    });
    expect(companyFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: { deletedAt: null, id: "company-1" },
    });
  });

  test("rejects content updates outside the active company scope", async () => {
    const configurationFindFirst = mock(async () => null);
    const versionFindFirst = mock(async () => null);
    const caller = websiteRouter.createCaller(
      contextFor({
        company: membershipCompany(),
        siteConfiguration: { findFirst: configurationFindFirst },
        websiteVersion: { findFirst: versionFindFirst },
      }),
    );

    await expect(
      caller.updateContentField({
        configId: "missing-config",
        contentKey: "hero.title",
        value: "Updated",
      }),
    ).rejects.toMatchObject({ code: "NOT_FOUND" });
    expect(configurationFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "missing-config",
      },
    });
    expect(versionFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        id: "missing-config",
        status: "draft",
        website: { companyId: "company-1", deletedAt: null },
      },
    });
  });
});
