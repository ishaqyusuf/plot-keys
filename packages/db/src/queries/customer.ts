import type { Db } from "../prisma";

export type SavedListingOverview = {
  id: string;
  savedAt: Date;
  property: {
    bedrooms: number | null;
    bathrooms: number | null;
    id: string;
    imageUrl: string | null;
    location: string;
    price: string | null;
    specs: string | null;
    title: string;
  };
};

export async function findCustomerByEmailForCompany(
  db: Db,
  input: {
    companyId: string;
    email: string;
  },
) {
  const normalizedEmail = input.email.trim().toLowerCase();

  if (!normalizedEmail) {
    return null;
  }

  return db.customer.findFirst({
    where: {
      companyId: input.companyId,
      deletedAt: null,
      email: {
        equals: normalizedEmail,
        mode: "insensitive",
      },
    },
  });
}

export async function createCustomer(
  db: Db,
  input: {
    companyId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    status?: "active" | "inactive" | "vip";
    sourceLeadId?: string | null;
  },
) {
  return db.customer.create({
    data: {
      companyId: input.companyId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      notes: input.notes ?? null,
      status: input.status ?? "active",
      sourceLeadId: input.sourceLeadId ?? null,
    },
  });
}

export async function listCustomersForCompany(
  db: Db,
  companyId: string,
  options: { status?: "active" | "inactive" | "vip"; take?: number } = {},
) {
  return db.customer.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: options.take ?? 100,
  });
}

export async function getCustomerById(
  db: Db,
  customerId: string,
  companyId: string,
) {
  return db.customer.findFirst({
    where: { id: customerId, companyId, deletedAt: null },
  });
}

export async function updateCustomer(
  db: Db,
  customerId: string,
  companyId: string,
  data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    notes?: string | null;
    status?: "active" | "inactive" | "vip";
  },
) {
  return db.customer.update({
    where: { id: customerId, companyId },
    data,
  });
}

export async function softDeleteCustomer(
  db: Db,
  customerId: string,
  companyId: string,
) {
  return db.customer.update({
    where: { id: customerId, companyId },
    data: { deletedAt: new Date() },
  });
}

export async function countCustomersByStatus(db: Db, companyId: string) {
  const rows = await db.customer.groupBy({
    by: ["status"],
    where: { companyId, deletedAt: null },
    _count: { id: true },
  });

  const result: Record<string, number> = { active: 0, inactive: 0, vip: 0 };
  for (const row of rows) {
    result[row.status] = row._count.id;
  }
  return result;
}

export async function isListingSavedForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    propertyId: string;
  },
) {
  const savedListing = await db.savedListing.findFirst({
    where: {
      companyId: input.companyId,
      customerId: input.customerId,
      propertyId: input.propertyId,
      customer: {
        companyId: input.companyId,
        deletedAt: null,
      },
      property: {
        companyId: input.companyId,
        deletedAt: null,
      },
    },
    select: {
      id: true,
    },
  });

  return Boolean(savedListing);
}

export async function saveListingForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    propertyId: string;
  },
) {
  const property = await db.property.findFirst({
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.propertyId,
    },
    select: {
      id: true,
    },
  });

  if (!property) {
    throw new Error("Property could not be found for this tenant.");
  }

  const customer = await db.customer.findFirst({
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customer) {
    throw new Error("Customer account is not available for this tenant.");
  }

  return db.savedListing.upsert({
    where: {
      customerId_propertyId: {
        customerId: input.customerId,
        propertyId: input.propertyId,
      },
    },
    create: {
      companyId: input.companyId,
      customerId: input.customerId,
      propertyId: input.propertyId,
    },
    update: {
      updatedAt: new Date(),
    },
  });
}

export async function removeSavedListingForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    propertyId: string;
  },
) {
  const { count } = await db.savedListing.deleteMany({
    where: {
      companyId: input.companyId,
      customerId: input.customerId,
      propertyId: input.propertyId,
    },
  });

  return count > 0;
}

export async function countSavedListingsForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
  },
) {
  return db.savedListing.count({
    where: {
      companyId: input.companyId,
      customerId: input.customerId,
      customer: {
        companyId: input.companyId,
        deletedAt: null,
      },
      property: {
        companyId: input.companyId,
        deletedAt: null,
      },
    },
  });
}

export async function listSavedListingsForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    take?: number;
  },
): Promise<SavedListingOverview[]> {
  const savedListings = await db.savedListing.findMany({
    where: {
      companyId: input.companyId,
      customerId: input.customerId,
      customer: {
        companyId: input.companyId,
        deletedAt: null,
      },
      property: {
        companyId: input.companyId,
        deletedAt: null,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    take: input.take,
    select: {
      id: true,
      createdAt: true,
      property: {
        select: {
          bathrooms: true,
          bedrooms: true,
          id: true,
          imageUrl: true,
          location: true,
          price: true,
          specs: true,
          title: true,
        },
      },
    },
  });

  return savedListings.map((savedListing) => ({
    id: savedListing.id,
    savedAt: savedListing.createdAt,
    property: savedListing.property,
  }));
}
