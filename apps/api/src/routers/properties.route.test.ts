import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
let propertiesRouter: typeof import("./properties.route")["propertiesRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ propertiesRouter } = await import("./properties.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const property = {
    companyId: "company-1",
    deletedAt: null,
    featured: false,
    id: "property-1",
    location: "Lagos",
    status: "active",
    title: "Ocean View",
  };
  const appointmentCount = mock(async () => 1);
  const analyticsEventCount = mock(async () => 4);
  const estateFindFirst = mock(async () => ({ id: "estate-1" }));
  const leadCount = mock(async () => 2);
  const propertyCount = mock(async () => 1);
  const propertyCreate = mock(async (query: unknown) => query);
  const propertyFindFirst = mock(async () => property);
  const propertyFindMany = mock(async () => [property]);
  const propertyUpdateMany = mock(async () => ({ count: 1 }));
  const db = {
    $transaction: async (operations: Promise<unknown>[]) =>
      Promise.all(operations),
    analyticsEvent: {
      count: analyticsEventCount,
    },
    appointment: {
      count: appointmentCount,
    },
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    estate: {
      findFirst: estateFindFirst,
    },
    lead: {
      count: leadCount,
    },
    property: {
      count: propertyCount,
      create: propertyCreate,
      findFirst: propertyFindFirst,
      findMany: propertyFindMany,
      updateMany: propertyUpdateMany,
    },
  };

  return {
    analyticsEventCount,
    appointmentCount,
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
    estateFindFirst,
    leadCount,
    propertyCount,
    propertyCreate,
    propertyFindFirst,
    propertyFindMany,
    propertyUpdateMany,
  };
}

describe("properties router", () => {
  test("lists properties through the active company scope", async () => {
    const { context, propertyCount, propertyFindMany } = contextFor();
    const caller = propertiesRouter.createCaller(context);

    await expect(
      caller.list({ q: "Ocean", size: 25, type: "residential" }),
    ).resolves.toMatchObject({
      data: [{ id: "property-1", title: "Ocean View" }],
      meta: { count: 1, size: 25 },
    });
    expect(propertyCount.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        type: "residential",
      },
    });
    expect(propertyFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        type: "residential",
      },
    });
  });

  test("loads property detail and analytics through company predicates", async () => {
    const {
      analyticsEventCount,
      appointmentCount,
      context,
      leadCount,
      propertyFindFirst,
    } = contextFor();
    const caller = propertiesRouter.createCaller(context);

    await expect(
      caller.get({ propertyId: "property-1" }),
    ).resolves.toMatchObject({
      analytics: {
        appointmentsCount: 1,
        leadsCount: 2,
        views30: 4,
        views7: 4,
      },
      property: { id: "property-1" },
    });
    expect(propertyFindFirst.mock.calls[0]?.[0]).toEqual({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "property-1",
      },
    });
    expect(analyticsEventCount.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        propertyId: "property-1",
      },
    });
    expect(leadCount.mock.calls[0]?.[0]).toMatchObject({
      where: { companyId: "company-1" },
    });
    expect(appointmentCount.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        propertyId: "property-1",
      },
    });
  });

  test("creates properties only after validating the estate scope", async () => {
    const { context, estateFindFirst, propertyCreate } = contextFor();
    const caller = propertiesRouter.createCaller(context);
    const estateId = "00000000-0000-0000-0000-000000000001";

    await caller.create({
      estateId,
      title: "New Listing",
    });

    expect(estateFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: estateId,
      },
    });
    expect(propertyCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        estateId,
        featured: false,
        status: "active",
        title: "New Listing",
      },
    });
  });

  test("rejects an estate outside the active company", async () => {
    const { context, estateFindFirst, propertyCreate } = contextFor();
    estateFindFirst.mockImplementationOnce(async () => null);
    const caller = propertiesRouter.createCaller(context);

    await expect(
      caller.create({
        estateId: "00000000-0000-0000-0000-000000000002",
        title: "Foreign Estate Listing",
      }),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Estate not found.",
    });
    expect(propertyCreate).not.toHaveBeenCalled();
  });

  test("updates properties through a company-qualified write", async () => {
    const { context, estateFindFirst, propertyUpdateMany } = contextFor();
    const caller = propertiesRouter.createCaller(context);
    const estateId = "00000000-0000-0000-0000-000000000001";

    await caller.update({
      estateId,
      propertyId: "property-1",
      title: "Updated Listing",
    });

    expect(estateFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: estateId,
      },
    });
    expect(propertyUpdateMany.mock.calls[0]?.[0]).toEqual({
      data: {
        estateId,
        title: "Updated Listing",
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "property-1",
      },
    });
  });

  test("toggles featured state through the active company scope", async () => {
    const { context, propertyFindFirst, propertyUpdateMany } = contextFor();
    const caller = propertiesRouter.createCaller(context);

    await expect(
      caller.toggleFeatured({ propertyId: "property-1" }),
    ).resolves.toEqual({
      featured: true,
      propertyId: "property-1",
    });
    expect(propertyFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { featured: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "property-1",
      },
    });
    expect(propertyUpdateMany.mock.calls[0]?.[0]).toEqual({
      data: { featured: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "property-1",
      },
    });
  });

  test("soft deletes unique properties through company predicates", async () => {
    const { context, propertyUpdateMany } = contextFor();
    const caller = propertiesRouter.createCaller(context);

    await expect(
      caller.deleteMany({
        propertyIds: ["property-1", "property-1", "property-2"],
      }),
    ).resolves.toEqual({
      ids: ["property-1", "property-2"],
    });
    expect(propertyUpdateMany).toHaveBeenCalledTimes(2);
    expect(propertyUpdateMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "property-1",
      },
    });
    expect(propertyUpdateMany.mock.calls[1]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: "property-2",
      },
    });
  });
});
