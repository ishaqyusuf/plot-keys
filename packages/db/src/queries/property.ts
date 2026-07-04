import { Prisma } from "../generated/prisma/client";
import { createPrismaClient, type Db } from "../prisma";

export type PropertyTypeValue =
  | "residential"
  | "commercial"
  | "land"
  | "industrial"
  | "mixed_use";

export const propertyTypeValues = [
  "residential",
  "commercial",
  "land",
  "industrial",
  "mixed_use",
] as const satisfies readonly PropertyTypeValue[];

function normalizePropertyType(
  value: string | null | undefined,
): PropertyTypeValue | undefined {
  return propertyTypeValues.includes(value as PropertyTypeValue)
    ? (value as PropertyTypeValue)
    : undefined;
}

export async function createProperty(
  db: Db,
  data: {
    companyId: string;
    estateId?: string | null;
    title: string;
    description?: string | null;
    price?: string | null;
    location?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    specs?: string | null;
    imageUrl?: string | null;
    type?: PropertyTypeValue | null;
    subType?: string | null;
    quantityAvailable?: number | null;
    paymentPlanMonths?: number | null;
    paymentPlanAmount?: string | null;
    paymentPlanInitialDepositPercent?: number | null;
    paymentPlanMonthlyAmount?: string | null;
    paymentPlansJson?: Prisma.InputJsonValue | null;
    status?: "active" | "sold" | "rented" | "off_market";
    featured?: boolean;
  },
) {
  return db.property.create({
    data: {
      companyId: data.companyId,
      estateId: data.estateId ?? null,
      title: data.title,
      description: data.description ?? null,
      price: data.price ?? null,
      location: data.location ?? "",
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      specs: data.specs ?? null,
      imageUrl: data.imageUrl ?? null,
      type: data.type ?? null,
      subType: data.subType ?? null,
      quantityAvailable: data.quantityAvailable ?? null,
      paymentPlanMonths: data.paymentPlanMonths ?? null,
      paymentPlanAmount: data.paymentPlanAmount ?? null,
      paymentPlanInitialDepositPercent:
        data.paymentPlanInitialDepositPercent ?? null,
      paymentPlanMonthlyAmount: data.paymentPlanMonthlyAmount ?? null,
      paymentPlansJson: data.paymentPlansJson ?? Prisma.JsonNull,
      status: data.status ?? "active",
      featured: data.featured ?? false,
    },
  });
}

export async function updateProperty(
  db: Db,
  propertyId: string,
  companyId: string,
  data: {
    title?: string;
    estateId?: string | null;
    description?: string | null;
    price?: string | null;
    location?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    specs?: string | null;
    imageUrl?: string | null;
    type?: PropertyTypeValue | null;
    subType?: string | null;
    quantityAvailable?: number | null;
    paymentPlanMonths?: number | null;
    paymentPlanAmount?: string | null;
    paymentPlanInitialDepositPercent?: number | null;
    paymentPlanMonthlyAmount?: string | null;
    paymentPlansJson?: Prisma.InputJsonValue | null;
    status?: "active" | "sold" | "rented" | "off_market";
    featured?: boolean;
  },
) {
  const updateData: Prisma.PropertyUpdateInput = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.estateId !== undefined) {
    updateData.estate = data.estateId
      ? { connect: { id: data.estateId } }
      : { disconnect: true };
  }
  if (data.description !== undefined) updateData.description = data.description;
  if (data.price !== undefined) updateData.price = data.price;
  if (data.location !== undefined) updateData.location = data.location ?? "";
  if (data.bedrooms !== undefined) updateData.bedrooms = data.bedrooms;
  if (data.bathrooms !== undefined) updateData.bathrooms = data.bathrooms;
  if (data.specs !== undefined) updateData.specs = data.specs;
  if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl;
  if (data.type !== undefined) updateData.type = data.type;
  if (data.subType !== undefined) updateData.subType = data.subType;
  if (data.quantityAvailable !== undefined) {
    updateData.quantityAvailable = data.quantityAvailable;
  }
  if (data.paymentPlanMonths !== undefined) {
    updateData.paymentPlanMonths = data.paymentPlanMonths;
  }
  if (data.paymentPlanAmount !== undefined) {
    updateData.paymentPlanAmount = data.paymentPlanAmount;
  }
  if (data.paymentPlanInitialDepositPercent !== undefined) {
    updateData.paymentPlanInitialDepositPercent =
      data.paymentPlanInitialDepositPercent;
  }
  if (data.paymentPlanMonthlyAmount !== undefined) {
    updateData.paymentPlanMonthlyAmount = data.paymentPlanMonthlyAmount;
  }
  if (data.paymentPlansJson !== undefined) {
    updateData.paymentPlansJson = data.paymentPlansJson ?? Prisma.JsonNull;
  }
  if (data.status !== undefined) updateData.status = data.status;
  if (data.featured !== undefined) updateData.featured = data.featured;

  return db.property.update({
    data: updateData,
    where: { id: propertyId, companyId, deletedAt: null },
  });
}

export async function deleteProperty(
  db: Db,
  propertyId: string,
  companyId: string,
) {
  return db.property.update({
    data: { deletedAt: new Date() },
    where: { id: propertyId, companyId, deletedAt: null },
  });
}

export async function getPropertyForCompany(
  db: Db,
  propertyId: string,
  companyId: string,
) {
  return db.property.findFirst({
    where: { id: propertyId, companyId, deletedAt: null },
  });
}

export async function togglePropertyFeatured(
  db: Db,
  propertyId: string,
  companyId: string,
) {
  const property = await db.property.findFirst({
    select: { featured: true },
    where: { id: propertyId, companyId, deletedAt: null },
  });

  if (!property) return null;

  return db.property.update({
    data: { featured: !property.featured },
    where: { id: propertyId, companyId },
  });
}

export async function listFeaturedProperties(
  db: Db,
  companyId: string,
  options: { includeUnpublished?: boolean } = {},
) {
  const properties = await db.property.findMany({
    include: {
      media: {
        include: { asset: true },
        where: { isCover: true },
        take: 1,
      },
    },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    where: {
      companyId,
      deletedAt: null,
      ...(options.includeUnpublished ? {} : { publishState: "published" }),
      status: "active",
    },
  });

  return properties.map((p) => ({
    ...p,
    imageUrl:
      p.imageUrl ?? p.media[0]?.asset?.publicUrl ?? p.media[0]?.url ?? null,
  }));
}

export async function listPropertiesForCompany(
  db: Db,
  companyId: string,
  options: { limit?: number; featured?: boolean } = {},
) {
  return db.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: options.limit ?? 20,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}

export async function listPropertyExportRows(db: Db, companyId: string) {
  return db.property.findMany({
    orderBy: { createdAt: "desc" },
    where: { companyId, deletedAt: null },
  });
}

export type PropertyExportRows = Awaited<
  ReturnType<typeof listPropertyExportRows>
>;

export type PropertyExportRowsResult =
  | { data: PropertyExportRows; ok: true }
  | { ok: false; reason: "database-unavailable" };

export async function getPropertyExportRows(
  companyId: string,
): Promise<PropertyExportRowsResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  return { data: await listPropertyExportRows(db, companyId), ok: true };
}

export type PropertyListFilters = {
  cursor?: string | number | null;
  q?: string | null;
  size?: string | number | null;
  sort?: string[] | null;
  type?: string | null;
};

function normalizePageSize(size: string | number | null | undefined) {
  const value = Number(size ?? 20);

  if (!Number.isFinite(value)) {
    return 20;
  }

  return Math.min(Math.max(Math.trunc(value), 1), 100);
}

function normalizeCursor(cursor: string | number | null | undefined) {
  const value = Number(cursor ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(Math.trunc(value), 0);
}

function getPropertyOrderBy(
  sort: string[] | null | undefined,
): Prisma.PropertyOrderByWithRelationInput[] {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return [{ featured: "desc" }, { createdAt: "desc" }];
  }

  switch (field) {
    case "price":
      return [{ price: direction }, { createdAt: "desc" }];
    case "status":
      return [{ status: direction }, { createdAt: "desc" }];
    case "title":
      return [{ title: direction }, { createdAt: "desc" }];
    case "type":
      return [{ type: direction }, { createdAt: "desc" }];
    default:
      return [{ featured: "desc" }, { createdAt: "desc" }];
  }
}

export async function listFilteredPropertiesForCompany(
  db: Db,
  companyId: string,
  filters: PropertyListFilters = {},
) {
  const query = filters.q?.trim() ?? "";
  const type = normalizePropertyType(filters.type);
  const size = normalizePageSize(filters.size);
  const offset = normalizeCursor(filters.cursor);
  const where: Prisma.PropertyWhereInput = {
    companyId,
    deletedAt: null,
    ...(type ? { type } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { location: { contains: query, mode: "insensitive" } },
            { price: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [count, data] = await db.$transaction([
    db.property.count({ where }),
    db.property.findMany({
      orderBy: getPropertyOrderBy(filters.sort),
      skip: offset,
      take: size,
      where,
    }),
  ]);
  const nextCursor = offset + size < count ? String(offset + size) : null;

  return {
    data,
    meta: {
      count,
      cursor: nextCursor,
      hasNextPage: nextCursor !== null,
      size,
    },
  };
}
