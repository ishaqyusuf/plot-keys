import { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";

export type EstatePublishStateValue = "draft" | "published" | "archived";
export type PlotStatusValue =
  | "available"
  | "held"
  | "reserved"
  | "sold"
  | "blocked";
export type PlotTypeValue =
  | "residential"
  | "commercial"
  | "mixed_use"
  | "amenity";

type JsonValue = Prisma.InputJsonValue | typeof Prisma.JsonNull;

function normalizeEstateSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export async function listEstatesForCompany(db: Db, companyId: string) {
  return db.estate.findMany({
    include: {
      _count: {
        select: {
          plots: {
            where: {
              deletedAt: null,
            },
          },
          properties: {
            where: {
              deletedAt: null,
            },
          },
          reservations: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
    where: {
      companyId,
      deletedAt: null,
    },
  });
}

export async function getEstateDetailForCompany(
  db: Db,
  companyId: string,
  slug: string,
) {
  return db.estate.findFirst({
    include: {
      layouts: {
        orderBy: [{ version: "desc" }, { createdAt: "desc" }],
        take: 3,
      },
      properties: {
        orderBy: [{ createdAt: "desc" }],
        take: 200,
        where: { deletedAt: null },
      },
      _count: {
        select: {
          reservations: true,
        },
      },
    },
    where: {
      companyId,
      deletedAt: null,
      slug,
    },
  });
}

export async function getEstateByIdForCompany(
  db: Db,
  companyId: string,
  estateId: string,
) {
  return db.estate.findFirst({
    select: { id: true },
    where: {
      companyId,
      deletedAt: null,
      id: estateId,
    },
  });
}

export async function getEstateForCompany(
  db: Db,
  estateId: string,
  companyId: string,
) {
  return db.estate.findFirst({
    where: {
      companyId,
      deletedAt: null,
      id: estateId,
    },
  });
}

export async function createEstate(
  db: Db,
  data: {
    companyId: string;
    title: string;
    slug: string;
    description?: string | null;
    location?: string | null;
    landmarks?: string | null;
    amenities?: string | null;
    approvals?: string | null;
    specialPurposeUses?: string | null;
    phaseLabel?: string | null;
    heroImageUrl?: string | null;
    brochureUrl?: string | null;
    publishState?: EstatePublishStateValue;
  },
) {
  return db.estate.create({
    data: {
      companyId: data.companyId,
      title: data.title,
      slug: data.slug,
      description: data.description ?? null,
      location: data.location ?? null,
      landmarks: data.landmarks ?? null,
      amenities: data.amenities ?? null,
      approvals: data.approvals ?? null,
      specialPurposeUses: data.specialPurposeUses ?? null,
      phaseLabel: data.phaseLabel ?? null,
      heroImageUrl: data.heroImageUrl ?? null,
      brochureUrl: data.brochureUrl ?? null,
      publishState: data.publishState ?? "draft",
    },
  });
}

export async function resolveUniqueEstateSlug(
  db: Db,
  input: {
    companyId: string;
    excludeEstateId?: string;
    requestedSlug: string;
  },
) {
  const baseSlug = normalizeEstateSlug(input.requestedSlug) || "estate-launch";
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await db.estate.findFirst({
      select: { id: true },
      where: {
        companyId: input.companyId,
        deletedAt: null,
        ...(input.excludeEstateId
          ? { id: { not: input.excludeEstateId } }
          : {}),
        slug: candidate,
      },
    });

    if (!existing) return candidate;

    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

export async function updateEstate(
  db: Db,
  estateId: string,
  companyId: string,
  data: {
    title?: string;
    slug?: string;
    description?: string | null;
    location?: string | null;
    landmarks?: string | null;
    amenities?: string | null;
    approvals?: string | null;
    specialPurposeUses?: string | null;
    phaseLabel?: string | null;
    heroImageUrl?: string | null;
    brochureUrl?: string | null;
    publishState?: EstatePublishStateValue;
  },
) {
  const updateData: Prisma.EstateUncheckedUpdateManyInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.slug !== undefined) updateData.slug = data.slug;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.location !== undefined) updateData.location = data.location;
  if (data.landmarks !== undefined) updateData.landmarks = data.landmarks;
  if (data.amenities !== undefined) updateData.amenities = data.amenities;
  if (data.approvals !== undefined) updateData.approvals = data.approvals;
  if (data.specialPurposeUses !== undefined) {
    updateData.specialPurposeUses = data.specialPurposeUses;
  }
  if (data.phaseLabel !== undefined) updateData.phaseLabel = data.phaseLabel;
  if (data.heroImageUrl !== undefined) {
    updateData.heroImageUrl = data.heroImageUrl;
  }
  if (data.brochureUrl !== undefined) updateData.brochureUrl = data.brochureUrl;
  if (data.publishState !== undefined) {
    updateData.publishState = data.publishState;
  }

  const result = await db.estate.updateMany({
    data: updateData,
    where: {
      id: estateId,
      companyId,
      deletedAt: null,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return getEstateForCompany(db, estateId, companyId);
}

export async function deleteEstate(
  db: Db,
  estateId: string,
  companyId: string,
) {
  return db.estate.updateMany({
    data: { deletedAt: new Date() },
    where: { id: estateId, companyId, deletedAt: null },
  });
}

export async function createEstateLayoutForCompany(
  db: Db,
  input: {
    companyId: string;
    estateId: string;
    sourceUrl: string;
  },
) {
  const estate = await db.estate.findFirst({
    select: { id: true },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.estateId,
    },
  });

  if (!estate) return null;

  const latest = await db.estateLayout.findFirst({
    orderBy: { version: "desc" },
    select: { version: true },
    where: { estateId: input.estateId },
  });

  return db.estateLayout.create({
    data: {
      estateId: input.estateId,
      sourceUrl: input.sourceUrl,
      version: (latest?.version ?? 0) + 1,
    },
  });
}

export async function listPlotsForEstate(
  db: Db,
  companyId: string,
  estateId: string,
) {
  return db.plot.findMany({
    orderBy: [{ plotCode: "asc" }, { createdAt: "asc" }],
    where: {
      companyId,
      estateId,
      deletedAt: null,
    },
  });
}

export async function createPlot(
  db: Db,
  data: {
    companyId: string;
    estateId: string;
    plotCode: string;
    block?: string | null;
    street?: string | null;
    sizeSqm?: number | null;
    price?: string | null;
    type?: PlotTypeValue | null;
    status?: PlotStatusValue;
    facing?: string | null;
    isCornerPiece?: boolean;
    isPremium?: boolean;
    coordinatesJson?: JsonValue | null;
    tagsJson?: JsonValue | null;
    metadataJson?: JsonValue | null;
  },
) {
  return db.plot.create({
    data: {
      companyId: data.companyId,
      estateId: data.estateId,
      plotCode: data.plotCode,
      block: data.block ?? null,
      street: data.street ?? null,
      sizeSqm: data.sizeSqm ?? null,
      price: data.price ?? null,
      type: data.type ?? null,
      status: data.status ?? "available",
      facing: data.facing ?? null,
      isCornerPiece: data.isCornerPiece ?? false,
      isPremium: data.isPremium ?? false,
      coordinatesJson: data.coordinatesJson ?? undefined,
      tagsJson: data.tagsJson ?? undefined,
      metadataJson: data.metadataJson ?? undefined,
    },
  });
}

export async function getPlotForCompany(
  db: Db,
  plotId: string,
  companyId: string,
) {
  return db.plot.findFirst({
    where: {
      companyId,
      deletedAt: null,
      id: plotId,
    },
  });
}

export async function updatePlot(
  db: Db,
  plotId: string,
  companyId: string,
  data: {
    plotCode?: string;
    block?: string | null;
    street?: string | null;
    sizeSqm?: number | null;
    price?: string | null;
    type?: PlotTypeValue | null;
    status?: PlotStatusValue;
    facing?: string | null;
    isCornerPiece?: boolean;
    isPremium?: boolean;
    coordinatesJson?: JsonValue | null;
    tagsJson?: JsonValue | null;
    metadataJson?: JsonValue | null;
  },
) {
  const updateData: Prisma.PlotUncheckedUpdateManyInput = {};

  if (data.plotCode !== undefined) updateData.plotCode = data.plotCode;
  if (data.block !== undefined) updateData.block = data.block;
  if (data.street !== undefined) updateData.street = data.street;
  if (data.sizeSqm !== undefined) updateData.sizeSqm = data.sizeSqm;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.status !== undefined) updateData.status = data.status;
  if (data.facing !== undefined) updateData.facing = data.facing;
  if (data.isCornerPiece !== undefined) {
    updateData.isCornerPiece = data.isCornerPiece;
  }
  if (data.isPremium !== undefined) updateData.isPremium = data.isPremium;
  if (data.coordinatesJson !== undefined) {
    updateData.coordinatesJson = data.coordinatesJson ?? Prisma.JsonNull;
  }
  if (data.tagsJson !== undefined) {
    updateData.tagsJson = data.tagsJson ?? Prisma.JsonNull;
  }
  if (data.metadataJson !== undefined) {
    updateData.metadataJson = data.metadataJson ?? Prisma.JsonNull;
  }

  const result = await db.plot.updateMany({
    data: updateData,
    where: {
      id: plotId,
      companyId,
      deletedAt: null,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return getPlotForCompany(db, plotId, companyId);
}

export async function deletePlot(db: Db, plotId: string, companyId: string) {
  return db.plot.updateMany({
    data: { deletedAt: new Date() },
    where: { id: plotId, companyId, deletedAt: null },
  });
}
