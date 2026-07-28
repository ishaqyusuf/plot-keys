import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
const originalVercelToken = process.env.VERCEL_API_TOKEN;
const originalDashboardProject = process.env.VERCEL_DASHBOARD_PROJECT_ID;
const originalSitefrontProject = process.env.VERCEL_SITEFRONT_PROJECT_ID;
let onboardingRouter: typeof import("./onboarding.route")["onboardingRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  delete process.env.VERCEL_API_TOKEN;
  delete process.env.VERCEL_DASHBOARD_PROJECT_ID;
  delete process.env.VERCEL_SITEFRONT_PROJECT_ID;
  ({ onboardingRouter } = await import("./onboarding.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }

  restoreEnv("VERCEL_API_TOKEN", originalVercelToken);
  restoreEnv("VERCEL_DASHBOARD_PROJECT_ID", originalDashboardProject);
  restoreEnv("VERCEL_SITEFRONT_PROJECT_ID", originalSitefrontProject);
});

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
  } else {
    process.env[name] = value;
  }
}

function contextFor(options: { membership?: boolean } = {}) {
  const onboarding = {
    businessSummary: "A modern property developer.",
    businessType: "developer",
    companyName: "Acme Homes",
    completedAt: null,
    complexity: "high",
    contactEmail: "hello@acme.test",
    conversionFocus: "leads",
    currentStep: "business-identity",
    designIntent: "editorial",
    hasAgents: true,
    hasBlogContent: true,
    hasExistingContent: false,
    hasListings: true,
    hasLogo: true,
    hasProjects: true,
    hasTestimonials: false,
    id: "onboarding-1",
    locations: ["Lagos"],
    market: "Lagos",
    officeAddress: "1 Marina Road",
    phone: "+2348000000000",
    preferredColorHint: "green",
    primaryGoal: "sell",
    propertyTypes: ["land"],
    recommendedTemplateKey: "template-1",
    segment: "developer",
    stylePreference: "minimal",
    subdomain: "acme-homes",
    tagline: "Built for tomorrow",
    targetAudience: ["Investors"],
    templateKey: "template-1",
    tone: "professional",
    userId: "user-1",
    whatsapp: "+2348000000000",
  };
  const companyCreate = mock(async (query: unknown) => ({
    id: "company-1",
    ...(query as { data: Record<string, unknown> }).data,
  }));
  const companyFindFirst = mock(async () => null);
  const companyFindUnique = mock(async () => ({ qaPurgeStartedAt: null }));
  const membershipCreate = mock(async (query: unknown) => query);
  const onboardingFindUnique = mock(async () => onboarding);
  const onboardingUpdate = mock(
    async (query: { data: Record<string, unknown> }) => ({
      ...onboarding,
      ...query.data,
    }),
  );
  const onboardingUpdateMany = mock(async () => ({ count: 1 }));
  const siteConfigurationCreate = mock(
    async (query: { data: Record<string, unknown> }) => ({
      ...query.data,
      companyId: "company-1",
      id: "config-1",
    }),
  );
  const tenantDomainCreateMany = mock(async () => ({ count: 2 }));
  const templateLicenseUpsert = mock(async (query: unknown) => query);
  const userFindUnique = mock(async () => ({ email: "owner@acme.test" }));
  const websiteCreate = mock(async () => ({ id: "website-1" }));
  const websiteUpdate = mock(async (query: unknown) => query);
  const websiteVersionCreate = mock(async () => ({ id: "version-1" }));
  const transaction = mock(async (operation: unknown) => {
    if (typeof operation === "function") {
      return (operation as (transactionDb: unknown) => Promise<unknown>)(db);
    }

    return Promise.all(operation as Promise<unknown>[]);
  });
  const db = {
    $transaction: transaction,
    company: {
      create: companyCreate,
      findFirst: companyFindFirst,
      findUnique: companyFindUnique,
    },
    membership: {
      create: membershipCreate,
    },
    siteConfiguration: {
      create: siteConfigurationCreate,
    },
    tenantDomain: {
      createMany: tenantDomainCreateMany,
    },
    tenantOnboarding: {
      findUnique: onboardingFindUnique,
      update: onboardingUpdate,
      updateMany: onboardingUpdateMany,
    },
    tenantTemplateLicense: {
      upsert: templateLicenseUpsert,
    },
    user: {
      findUnique: userFindUnique,
    },
    website: {
      create: websiteCreate,
      update: websiteUpdate,
    },
    websiteVersion: {
      create: websiteVersionCreate,
    },
  };

  return {
    companyCreate,
    companyFindFirst,
    context: {
      auth: {
        activeMembership: options.membership
          ? {
              companyId: "company-1",
              role: "owner",
              workRole: "operations",
            }
          : null,
        session: {
          user: {
            email: null,
            id: "user-1",
            name: "Test Owner",
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
    membershipCreate,
    onboardingFindUnique,
    onboardingUpdate,
    onboardingUpdateMany,
    siteConfigurationCreate,
    tenantDomainCreateMany,
    templateLicenseUpsert,
  };
}

describe("onboarding router", () => {
  test("returns the authenticated user's safe onboarding state", async () => {
    const { context, onboardingFindUnique } = contextFor();
    const caller = onboardingRouter.createCaller(context);

    await expect(caller.get()).resolves.toMatchObject({
      businessType: "developer",
      companyName: "Acme Homes",
      currentStep: "business-identity",
      subdomain: "acme-homes",
    });
    expect(onboardingFindUnique.mock.calls[0]?.[0]).toEqual({
      where: { userId: "user-1" },
    });
  });

  test("saves progress and refreshes the derived profile", async () => {
    const { context, onboardingUpdate } = contextFor();
    const caller = onboardingRouter.createCaller(context);

    await expect(
      caller.saveProgress({
        businessType: "agency",
        currentStep: "market-focus",
      }),
    ).resolves.toMatchObject({
      profile: {
        conversionFocus: expect.any(String),
        designIntent: expect.any(String),
        segment: expect.any(String),
      },
      saved: true,
    });
    expect(onboardingUpdate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        businessType: "agency",
        currentStep: "market-focus",
      },
      where: { userId: "user-1" },
    });
    expect(onboardingUpdate.mock.calls[1]?.[0]).toMatchObject({
      data: {
        businessSummary: expect.any(String),
        recommendedTemplateKey: expect.any(String),
      },
      where: { userId: "user-1" },
    });
  });

  test("rejects progress saves without a signup onboarding record", async () => {
    const { context, onboardingFindUnique, onboardingUpdate } = contextFor();
    onboardingFindUnique.mockImplementationOnce(async () => null);
    const caller = onboardingRouter.createCaller(context);

    await expect(
      caller.saveProgress({ currentStep: "market-focus" }),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      message:
        "No onboarding record found. Complete sign-up before saving progress.",
    });
    expect(onboardingUpdate).not.toHaveBeenCalled();
  });

  test("returns starter-accessible template recommendations", async () => {
    const { context } = contextFor();
    const caller = onboardingRouter.createCaller(context);

    await expect(caller.recommendations()).resolves.toMatchObject({
      profile: {
        conversionFocus: expect.any(String),
        designIntent: expect.any(String),
        segment: expect.any(String),
      },
      recommendations: expect.any(Array),
      topKey: expect.any(String),
    });
  });

  test("updates post-onboarding inputs through the active membership", async () => {
    const { context, onboardingUpdate } = contextFor({ membership: true });
    const caller = onboardingRouter.createCaller(context);

    await expect(
      caller.updateInputs({
        businessType: "luxury_firm",
        tone: "luxury",
      }),
    ).resolves.toMatchObject({
      profile: {
        conversionFocus: expect.any(String),
        designIntent: expect.any(String),
        segment: expect.any(String),
      },
      recommendations: expect.any(Array),
      summary: expect.any(String),
    });
    expect(onboardingUpdate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        businessType: "luxury_firm",
        tone: "luxury",
      },
      where: { userId: "user-1" },
    });
  });

  test("completes onboarding through the full tenant bundle", async () => {
    const {
      companyCreate,
      companyFindFirst,
      context,
      membershipCreate,
      onboardingUpdateMany,
      siteConfigurationCreate,
      tenantDomainCreateMany,
      templateLicenseUpsert,
    } = contextFor();
    const caller = onboardingRouter.createCaller(context);

    await expect(
      caller.complete({
        companyName: "Fallback Company",
        market: "Lagos",
        subdomain: "fallback-company",
        templateKey: "template-1",
      }),
    ).resolves.toEqual({ configId: "config-1" });
    expect(companyFindFirst.mock.calls[0]?.[0]).toEqual({
      where: {
        deletedAt: null,
        slug: "acme-homes",
      },
    });
    expect(companyCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        market: "Lagos",
        name: "Acme Homes",
        slug: "acme-homes",
      },
    });
    expect(membershipCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        role: "owner",
        userId: "user-1",
      },
    });
    expect(tenantDomainCreateMany.mock.calls[0]?.[0]).toMatchObject({
      data: [
        {
          companyId: "company-1",
          kind: "sitefront_subdomain",
        },
        {
          companyId: "company-1",
          kind: "dashboard_subdomain",
        },
      ],
    });
    expect(siteConfigurationCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        createdById: "user-1",
        templateKey: "template-1",
      },
    });
    expect(onboardingUpdateMany.mock.calls[0]?.[0]).toMatchObject({
      data: {
        completedAt: expect.any(Date),
        currentStep: "done",
      },
      where: {
        completedAt: null,
        userId: "user-1",
      },
    });
    expect(templateLicenseUpsert.mock.calls[0]?.[0]).toMatchObject({
      create: {
        companyId: "company-1",
        grantedById: "user-1",
        source: "free",
        templateKey: "template-1",
      },
    });
  });

  test("rejects completion when the user already has a membership", async () => {
    const { context } = contextFor({ membership: true });
    const caller = onboardingRouter.createCaller(context);

    await expect(
      caller.complete({
        companyName: "Acme Homes",
        market: "Lagos",
        subdomain: "acme-homes",
        templateKey: "template-1",
      }),
    ).rejects.toMatchObject({
      code: "BAD_REQUEST",
      message: "Onboarding has already been completed for this user.",
    });
  });
});
