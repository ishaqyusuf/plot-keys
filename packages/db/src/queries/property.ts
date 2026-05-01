import { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";

export type PropertyTypeValue =
  | "residential"
  | "commercial"
  | "land"
  | "industrial"
  | "mixed_use";

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
    imageUrl: p.imageUrl ?? p.media[0]?.url ?? null,
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
