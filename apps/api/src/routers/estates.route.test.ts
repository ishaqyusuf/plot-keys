import { afterAll, beforeAll, describe, expect, test } from "bun:test";

import type { TRPCContext } from "../context";
import { mock } from "../test/mock";

const originalDatabaseUrl = process.env.DATABASE_URL;
const estateId = "00000000-0000-0000-0000-000000000001";
const plotId = "00000000-0000-0000-0000-000000000002";
let estatesRouter: typeof import("./estates.route")["estatesRouter"];

beforeAll(async () => {
  process.env.DATABASE_URL ??=
    "postgresql://postgres:postgres@127.0.0.1:55432/plotkeys";
  ({ estatesRouter } = await import("./estates.route"));
});

afterAll(() => {
  if (originalDatabaseUrl === undefined) {
    delete process.env.DATABASE_URL;
  } else {
    process.env.DATABASE_URL = originalDatabaseUrl;
  }
});

function contextFor() {
  const estate = {
    _count: {
      plots: 1,
      properties: 2,
      reservations: 3,
    },
    companyId: "company-1",
    deletedAt: null,
    id: estateId,
    layouts: [],
    properties: [],
    publishState: "draft",
    slug: "ocean-gardens",
    title: "Ocean Gardens",
  };
  const plot = {
    companyId: "company-1",
    deletedAt: null,
    estateId,
    id: plotId,
    plotCode: "A-01",
    status: "available",
  };
  const estateCreate = mock(async (query: unknown) => query);
  const estateFindFirst = mock(
    async (query: {
      select?: { id?: boolean };
      where?: { id?: unknown; slug?: string };
    }) => {
      if (query.where?.slug && query.select?.id) {
        return null;
      }

      if (query.select?.id) {
        return { id: estateId };
      }

      return estate;
    },
  );
  const estateFindMany = mock(async () => [estate]);
  const estateUpdateMany = mock(async () => ({ count: 1 }));
  const estateLayoutCreate = mock(async (query: unknown) => query);
  const estateLayoutFindFirst = mock(async () => ({ version: 2 }));
  const plotCreate = mock(async (query: unknown) => query);
  const plotFindFirst = mock(async () => plot);
  const plotFindMany = mock(async () => [plot]);
  const plotUpdateMany = mock(async () => ({ count: 1 }));
  const db = {
    company: {
      findUnique: mock(async () => ({ qaPurgeStartedAt: null })),
    },
    estate: {
      create: estateCreate,
      findFirst: estateFindFirst,
      findMany: estateFindMany,
      updateMany: estateUpdateMany,
    },
    estateLayout: {
      create: estateLayoutCreate,
      findFirst: estateLayoutFindFirst,
    },
    plot: {
      create: plotCreate,
      findFirst: plotFindFirst,
      findMany: plotFindMany,
      updateMany: plotUpdateMany,
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
    estateCreate,
    estateFindFirst,
    estateFindMany,
    estateLayoutCreate,
    estateLayoutFindFirst,
    estateUpdateMany,
    plotCreate,
    plotFindFirst,
    plotFindMany,
    plotUpdateMany,
  };
}

describe("estates router", () => {
  test("lists estate launches through the active company scope", async () => {
    const { context, estateFindMany } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await expect(caller.list()).resolves.toMatchObject([
      { id: estateId, title: "Ocean Gardens" },
    ]);
    expect(estateFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
      },
    });
  });

  test("loads estate details through company and slug predicates", async () => {
    const { context, estateFindFirst } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await expect(caller.get({ slug: "ocean-gardens" })).resolves.toMatchObject({
      id: estateId,
      title: "Ocean Gardens",
    });
    expect(estateFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        slug: "ocean-gardens",
      },
    });
  });

  test("creates a company estate with a tenant-unique slug", async () => {
    const { context, estateCreate, estateFindFirst } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await caller.create({ title: "Ocean Gardens" });

    expect(estateFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        slug: "ocean-gardens",
      },
    });
    expect(estateCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        publishState: "draft",
        slug: "ocean-gardens",
        title: "Ocean Gardens",
      },
    });
  });

  test("updates estates through slug exclusion and company predicates", async () => {
    const { context, estateFindFirst, estateUpdateMany } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await caller.update({
      estateId,
      slug: "Renamed Estate",
      title: "Renamed Estate",
    });

    expect(estateFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: { not: estateId },
        slug: "renamed-estate",
      },
    });
    expect(estateUpdateMany.mock.calls[0]?.[0]).toEqual({
      data: {
        slug: "renamed-estate",
        title: "Renamed Estate",
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: estateId,
      },
    });
  });

  test("returns not found when an estate update misses tenant scope", async () => {
    const { context, estateUpdateMany } = contextFor();
    estateUpdateMany.mockImplementationOnce(async () => ({ count: 0 }));
    const caller = estatesRouter.createCaller(context);

    await expect(
      caller.update({ estateId, title: "Foreign Estate" }),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Estate launch not found.",
    });
  });

  test("soft deletes estates through the active company scope", async () => {
    const { context, estateUpdateMany } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await expect(caller.delete({ estateId })).resolves.toEqual({ estateId });
    expect(estateUpdateMany.mock.calls[0]?.[0]).toMatchObject({
      data: {
        deletedAt: expect.any(Date),
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: estateId,
      },
    });
  });

  test("creates the next layout version for a company estate", async () => {
    const {
      context,
      estateFindFirst,
      estateLayoutCreate,
      estateLayoutFindFirst,
    } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await caller.createLayout({
      estateId,
      sourceUrl: "https://assets.example.com/layout.pdf",
    });

    expect(estateFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: estateId,
      },
    });
    expect(estateLayoutFindFirst.mock.calls[0]?.[0]).toMatchObject({
      where: { estateId },
    });
    expect(estateLayoutCreate.mock.calls[0]?.[0]).toEqual({
      data: {
        estateId,
        sourceUrl: "https://assets.example.com/layout.pdf",
        version: 3,
      },
    });
  });

  test("lists plots through company and estate predicates", async () => {
    const { context, plotFindMany } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await expect(caller.listPlots({ estateId })).resolves.toMatchObject([
      { id: plotId, plotCode: "A-01" },
    ]);
    expect(plotFindMany.mock.calls[0]?.[0]).toMatchObject({
      where: {
        companyId: "company-1",
        deletedAt: null,
        estateId,
      },
    });
  });

  test("creates plots only after validating the estate tenant", async () => {
    const { context, estateFindFirst, plotCreate } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await caller.createPlot({ estateId, plotCode: "A-01" });

    expect(estateFindFirst.mock.calls[0]?.[0]).toEqual({
      select: { id: true },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: estateId,
      },
    });
    expect(plotCreate.mock.calls[0]?.[0]).toMatchObject({
      data: {
        companyId: "company-1",
        estateId,
        plotCode: "A-01",
        status: "available",
      },
    });
  });

  test("rejects plot creation for an estate outside the company", async () => {
    const { context, estateFindFirst, plotCreate } = contextFor();
    estateFindFirst.mockImplementationOnce(async () => null);
    const caller = estatesRouter.createCaller(context);

    await expect(
      caller.createPlot({ estateId, plotCode: "A-01" }),
    ).rejects.toMatchObject({
      code: "NOT_FOUND",
      message: "Estate launch not found.",
    });
    expect(plotCreate).not.toHaveBeenCalled();
  });

  test("updates plots through a company-qualified write", async () => {
    const { context, plotUpdateMany } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await caller.updatePlot({
      plotId,
      price: "25000000",
      status: "reserved",
    });

    expect(plotUpdateMany.mock.calls[0]?.[0]).toEqual({
      data: {
        price: "25000000",
        status: "reserved",
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: plotId,
      },
    });
  });

  test("soft deletes plots through the active company scope", async () => {
    const { context, plotUpdateMany } = contextFor();
    const caller = estatesRouter.createCaller(context);

    await expect(caller.deletePlot({ plotId })).resolves.toEqual({ plotId });
    expect(plotUpdateMany.mock.calls[0]?.[0]).toMatchObject({
      data: {
        deletedAt: expect.any(Date),
      },
      where: {
        companyId: "company-1",
        deletedAt: null,
        id: plotId,
      },
    });
  });
});
