import type { Db } from "../prisma";

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
    take: options.limit ?? 50,
    where: {
      companyId,
      deletedAt: null,
      ...(options.featured !== undefined && { featured: options.featured }),
    },
  });
}

export type CreatePropertyInput = {
  bathrooms?: number | null;
  bedrooms?: number | null;
  description?: string | null;
  featured?: boolean;
  imageUrl?: string | null;
  location: string;
  price?: string | null;
  specs?: string | null;
  status?: string;
  title: string;
};

export async function createProperty(
  db: Db,
  companyId: string,
  data: CreatePropertyInput,
) {
  return db.property.create({
    data: {
      bathrooms: data.bathrooms ?? null,
      bedrooms: data.bedrooms ?? null,
      companyId,
      description: data.description ?? null,
      featured: data.featured ?? false,
      imageUrl: data.imageUrl ?? null,
      location: data.location,
      price: data.price ?? null,
      specs: data.specs ?? null,
      status: (data.status ?? "active") as "active" | "sold" | "rented" | "off_market",
      title: data.title,
    },
  });
}

export async function updateProperty(
  db: Db,
  propertyId: string,
  companyId: string,
  data: Partial<CreatePropertyInput>,
) {
  return db.property.updateMany({
    data: {
      ...(data.title !== undefined && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.price !== undefined && { price: data.price }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.bedrooms !== undefined && { bedrooms: data.bedrooms }),
      ...(data.bathrooms !== undefined && { bathrooms: data.bathrooms }),
      ...(data.specs !== undefined && { specs: data.specs }),
      ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      ...(data.status !== undefined && {
        status: data.status as "active" | "sold" | "rented" | "off_market",
      }),
      ...(data.featured !== undefined && { featured: data.featured }),
    },
    where: { companyId, deletedAt: null, id: propertyId },
  });
}

export async function deleteProperty(
  db: Db,
  propertyId: string,
  companyId: string,
) {
  return db.property.updateMany({
    data: { deletedAt: new Date() },
    where: { companyId, deletedAt: null, id: propertyId },
  });
}

export async function togglePropertyFeatured(
  db: Db,
  propertyId: string,
  companyId: string,
  featured: boolean,
) {
  return db.property.updateMany({
    data: { featured },
    where: { companyId, deletedAt: null, id: propertyId },
  });
}
