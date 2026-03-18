import type { Db } from "../prisma";

export async function createProperty(
  db: Db,
  data: {
    companyId: string;
    title: string;
    description?: string | null;
    price?: string | null;
    location?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    specs?: string | null;
    imageUrl?: string | null;
    status?: "active" | "sold" | "rented" | "off_market";
    featured?: boolean;
  },
) {
  return db.property.create({
    data: {
      companyId: data.companyId,
      title: data.title,
      description: data.description ?? null,
      price: data.price ?? null,
      location: data.location ?? null,
      bedrooms: data.bedrooms ?? null,
      bathrooms: data.bathrooms ?? null,
      specs: data.specs ?? null,
      imageUrl: data.imageUrl ?? null,
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
    description?: string | null;
    price?: string | null;
    location?: string | null;
    bedrooms?: number | null;
    bathrooms?: number | null;
    specs?: string | null;
    imageUrl?: string | null;
    status?: "active" | "sold" | "rented" | "off_market";
    featured?: boolean;
  },
) {
  return db.property.update({
    data,
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

export async function listFeaturedProperties(db: Db, companyId: string) {
  return db.property.findMany({
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 6,
    where: {
      companyId,
      deletedAt: null,
      status: "active",
    },
  });
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
