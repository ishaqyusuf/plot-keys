import type { Prisma } from "../generated/prisma/client";
import { createPrismaClient, type Db } from "../prisma";
import {
  composeQuery,
  composeQueryData,
  type PaginationQuery,
} from "@plotkeys/utils/query-response";

export type CustomerStatusValue = "active" | "inactive" | "vip";

export const customerStatusValues = [
  "active",
  "inactive",
  "vip",
] as const satisfies readonly CustomerStatusValue[];

function normalizeCustomerStatus(
  value: string | null | undefined,
): CustomerStatusValue | undefined {
  return customerStatusValues.includes(value as CustomerStatusValue)
    ? (value as CustomerStatusValue)
    : undefined;
}

function parseDateBoundary(
  value: string | null | undefined,
  boundary: "end" | "start",
) {
  if (!value) return null;

  const suffix = boundary === "start" ? "T00:00:00.000Z" : "T23:59:59.999Z";
  const date = new Date(`${value}${suffix}`);

  return Number.isNaN(date.getTime()) ? null : date;
}

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

export async function listCustomerExportRows(db: Db, companyId: string) {
  return db.customer.findMany({
    orderBy: { createdAt: "desc" },
    where: { companyId, deletedAt: null },
  });
}

export type CustomerExportRows = Awaited<
  ReturnType<typeof listCustomerExportRows>
>;

export type CustomerExportRowsResult =
  | { data: CustomerExportRows; ok: true }
  | { ok: false; reason: "database-unavailable" };

export async function getCustomerExportRows(
  companyId: string,
): Promise<CustomerExportRowsResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  return { data: await listCustomerExportRows(db, companyId), ok: true };
}

export type CustomerListFilters = {
  end?: string | null;
  filter?: string | null;
  q?: string | null;
  start?: string | null;
  take?: number;
};

export type CustomerListQuery = PaginationQuery & {
  end?: string | null;
  filter?: string | null;
  start?: string | null;
};

export type CustomerRowDto = {
  createdAt: Date;
  email: string | null;
  id: string;
  name: string;
  notes: string | null;
  phone: string | null;
  status: string;
};

function customerDto(customer: CustomerRowDto): CustomerRowDto {
  return {
    createdAt: customer.createdAt,
    email: customer.email,
    id: customer.id,
    name: customer.name,
    notes: customer.notes,
    phone: customer.phone,
    status: customer.status,
  };
}

export function whereCustomers(query: CustomerListQuery, companyId: string) {
  const endDate = parseDateBoundary(query.end, "end");
  const search = query.q?.trim();
  const startDate = parseDateBoundary(query.start, "start");
  const status = normalizeCustomerStatus(query.filter);
  const createdAtFilter: Prisma.DateTimeFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;

  return composeQuery([
    { companyId },
    createdAtFilter ? { createdAt: createdAtFilter } : null,
    status ? { status } : null,
    search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
          ],
        }
      : null,
  ]);
}

export async function getCustomers(
  db: Db,
  companyId: string,
  query: CustomerListQuery,
) {
  const where = whereCustomers(query, companyId);
  const { queryProps, response } = await composeQueryData(
    query,
    where,
    db.customer,
  );
  const customers = await db.customer.findMany({
    ...queryProps,
    select: {
      createdAt: true,
      email: true,
      id: true,
      name: true,
      notes: true,
      phone: true,
      status: true,
    },
  });

  return response(customers.map(customerDto));
}

export async function listFilteredCustomersForCompany(
  db: Db,
  companyId: string,
  filters: CustomerListFilters = {},
) {
  const endDate = parseDateBoundary(filters.end, "end");
  const query = filters.q?.trim() ?? "";
  const startDate = parseDateBoundary(filters.start, "start");
  const status = normalizeCustomerStatus(filters.filter);
  const createdAtFilter: Prisma.DateTimeFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;

  return db.customer.findMany({
    orderBy: { createdAt: "desc" },
    take: filters.take ?? 100,
    where: {
      companyId,
      deletedAt: null,
      ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
      ...(status ? { status } : {}),
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { phone: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
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

export type CustomerOfferOverview = {
  id: string;
  status: "pending" | "accepted" | "rejected" | "withdrawn";
  offerAmount: string | null;
  message: string | null;
  submittedAt: Date;
  selectedPlot: {
    id: string;
    plotCode: string;
    status: "available" | "held" | "reserved" | "sold" | "blocked";
  } | null;
  property: {
    id: string;
    title: string;
    location: string;
    price: string | null;
    imageUrl: string | null;
    estateId: string | null;
  };
};

type CustomerOfferSelectedPlot = NonNullable<
  CustomerOfferOverview["selectedPlot"]
>;

export type CustomerPlotSelectionDetails = {
  offer: CustomerOfferOverview;
  estate: {
    id: string;
    title: string;
    slug: string;
    location: string | null;
  };
  layout: {
    id: string;
    sourceUrl: string;
    normalizedImageUrl: string | null;
    imageWidth: number | null;
    imageHeight: number | null;
    version: number;
  };
  plots: Array<{
    id: string;
    plotCode: string;
    block: string | null;
    street: string | null;
    sizeSqm: number | null;
    price: string | null;
    status: "available" | "held" | "reserved" | "sold" | "blocked";
    coordinatesJson: unknown;
  }>;
};

const offerSelectionNotePrefix = "customer_offer:";

function buildOfferSelectionNote(offerId: string) {
  return `${offerSelectionNotePrefix}${offerId}`;
}

export async function hasPendingOfferForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    propertyId: string;
  },
) {
  const offer = await db.customerOffer.findFirst({
    where: {
      companyId: input.companyId,
      customerId: input.customerId,
      propertyId: input.propertyId,
      status: "pending",
    },
    select: { id: true },
  });

  return Boolean(offer);
}

export async function submitOfferForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    propertyId: string;
    offerAmount?: string | null;
    message?: string | null;
  },
) {
  const property = await db.property.findFirst({
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.propertyId,
    },
    select: { id: true },
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
    select: { id: true },
  });

  if (!customer) {
    throw new Error("Customer account is not available for this tenant.");
  }

  const alreadyPending = await hasPendingOfferForCustomer(db, {
    companyId: input.companyId,
    customerId: input.customerId,
    propertyId: input.propertyId,
  });

  if (alreadyPending) {
    throw new Error("You already have a pending offer on this property.");
  }

  return db.customerOffer.create({
    data: {
      companyId: input.companyId,
      customerId: input.customerId,
      propertyId: input.propertyId,
      offerAmount: input.offerAmount ?? null,
      message: input.message ?? null,
    },
  });
}

export async function withdrawOfferForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    offerId: string;
  },
) {
  const offer = await db.customerOffer.findFirst({
    where: {
      id: input.offerId,
      companyId: input.companyId,
      customerId: input.customerId,
      status: "pending",
    },
    select: { id: true },
  });

  if (!offer) {
    return false;
  }

  await db.customerOffer.update({
    where: { id: offer.id },
    data: { status: "withdrawn" },
  });

  return true;
}

export async function countOffersForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
  },
) {
  return db.customerOffer.count({
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

export async function listOffersForCustomer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    take?: number;
  },
): Promise<CustomerOfferOverview[]> {
  const offers = await db.customerOffer.findMany({
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
    orderBy: { createdAt: "desc" },
    take: input.take,
    select: {
      id: true,
      status: true,
      offerAmount: true,
      message: true,
      createdAt: true,
      property: {
        select: {
          estateId: true,
          id: true,
          title: true,
          location: true,
          price: true,
          imageUrl: true,
        },
      },
    },
  });

  return Promise.all(
    offers.map(async (offer) => {
      const selectedPlot = offer.property.estateId
        ? await db.plot.findFirst({
            select: {
              id: true,
              plotCode: true,
              status: true,
            },
            where: {
              companyId: input.companyId,
              deletedAt: null,
              reservationChoices: {
                some: {
                  isPrimary: true,
                  reservation: {
                    companyId: input.companyId,
                    customerId: input.customerId,
                    estateId: offer.property.estateId,
                    notes: { contains: buildOfferSelectionNote(offer.id) },
                    status: "approved",
                  },
                },
              },
            },
          })
        : null;

      return {
        id: offer.id,
        status: offer.status as CustomerOfferOverview["status"],
        offerAmount: offer.offerAmount,
        message: offer.message,
        selectedPlot: selectedPlot
          ? {
              id: selectedPlot.id,
              plotCode: selectedPlot.plotCode,
              status:
                selectedPlot.status as CustomerOfferSelectedPlot["status"],
            }
          : null,
        submittedAt: offer.createdAt,
        property: offer.property,
      };
    }),
  );
}

export async function getCustomerPlotSelectionDetails(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    offerId: string;
  },
): Promise<CustomerPlotSelectionDetails | null> {
  const offer = await db.customerOffer.findFirst({
    where: {
      companyId: input.companyId,
      customerId: input.customerId,
      id: input.offerId,
      status: "accepted",
      customer: {
        companyId: input.companyId,
        deletedAt: null,
      },
      property: {
        companyId: input.companyId,
        deletedAt: null,
        estateId: { not: null },
      },
    },
    select: {
      id: true,
      status: true,
      offerAmount: true,
      message: true,
      createdAt: true,
      property: {
        select: {
          estate: {
            select: {
              id: true,
              title: true,
              slug: true,
              location: true,
              layouts: {
                orderBy: [
                  { status: "desc" },
                  { version: "desc" },
                  { createdAt: "desc" },
                ],
                select: {
                  id: true,
                  sourceUrl: true,
                  normalizedImageUrl: true,
                  imageWidth: true,
                  imageHeight: true,
                  version: true,
                },
                take: 1,
                where: {
                  status: { in: ["published", "draft"] },
                },
              },
              plots: {
                orderBy: [{ plotCode: "asc" }, { createdAt: "asc" }],
                select: {
                  id: true,
                  plotCode: true,
                  block: true,
                  street: true,
                  sizeSqm: true,
                  price: true,
                  status: true,
                  coordinatesJson: true,
                },
                where: { deletedAt: null },
              },
            },
          },
          estateId: true,
          id: true,
          imageUrl: true,
          location: true,
          price: true,
          title: true,
        },
      },
    },
  });

  const estate = offer?.property.estate;
  const layout = estate?.layouts[0];

  if (!offer || !estate || !layout) return null;

  const selectedPlot = await db.plot.findFirst({
    select: {
      id: true,
      plotCode: true,
      status: true,
    },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      reservationChoices: {
        some: {
          isPrimary: true,
          reservation: {
            companyId: input.companyId,
            customerId: input.customerId,
            estateId: estate.id,
            notes: { contains: buildOfferSelectionNote(offer.id) },
            status: "approved",
          },
        },
      },
    },
  });

  return {
    estate: {
      id: estate.id,
      location: estate.location,
      slug: estate.slug,
      title: estate.title,
    },
    layout,
    offer: {
      id: offer.id,
      message: offer.message,
      offerAmount: offer.offerAmount,
      property: {
        estateId: offer.property.estateId,
        id: offer.property.id,
        imageUrl: offer.property.imageUrl,
        location: offer.property.location,
        price: offer.property.price,
        title: offer.property.title,
      },
      selectedPlot: selectedPlot
        ? {
            id: selectedPlot.id,
            plotCode: selectedPlot.plotCode,
            status: selectedPlot.status as CustomerOfferSelectedPlot["status"],
          }
        : null,
      status: offer.status as CustomerOfferOverview["status"],
      submittedAt: offer.createdAt,
    },
    plots: estate.plots.map((plot) => ({
      ...plot,
      coordinatesJson: plot.coordinatesJson,
      status:
        plot.status as CustomerPlotSelectionDetails["plots"][number]["status"],
    })),
  };
}

export async function selectPreferredPlotForAcceptedOffer(
  db: Db,
  input: {
    companyId: string;
    customerId: string;
    offerId: string;
    plotId: string;
  },
) {
  return db.$transaction(async (tx) => {
    const offer = await tx.customerOffer.findFirst({
      where: {
        companyId: input.companyId,
        customerId: input.customerId,
        id: input.offerId,
        status: "accepted",
        customer: {
          companyId: input.companyId,
          deletedAt: null,
        },
        property: {
          companyId: input.companyId,
          deletedAt: null,
          estateId: { not: null },
        },
      },
      select: {
        id: true,
        property: {
          select: {
            estateId: true,
          },
        },
      },
    });

    const estateId = offer?.property.estateId;

    if (!offer || !estateId) {
      throw new Error(
        "Plot selection is only available for accepted estate offers.",
      );
    }

    const existingReservation = await tx.plotReservation.findFirst({
      select: { id: true },
      where: {
        companyId: input.companyId,
        customerId: input.customerId,
        estateId,
        notes: { contains: buildOfferSelectionNote(offer.id) },
        status: "approved",
      },
    });

    if (existingReservation) {
      throw new Error("A plot has already been selected for this offer.");
    }

    const plot = await tx.plot.findFirst({
      select: {
        id: true,
        status: true,
      },
      where: {
        companyId: input.companyId,
        deletedAt: null,
        estateId,
        id: input.plotId,
      },
    });

    if (!plot) {
      throw new Error("Selected plot could not be found for this estate.");
    }

    if (plot.status !== "available") {
      throw new Error(
        "That plot is no longer available. Please choose another plot.",
      );
    }

    const updateResult = await tx.plot.updateMany({
      data: { status: "reserved" },
      where: {
        companyId: input.companyId,
        deletedAt: null,
        estateId,
        id: input.plotId,
        status: "available",
      },
    });

    if (updateResult.count !== 1) {
      throw new Error(
        "That plot is no longer available. Please choose another plot.",
      );
    }

    const reservation = await tx.plotReservation.create({
      data: {
        approvedAt: new Date(),
        choices: {
          create: {
            isPrimary: true,
            plotId: input.plotId,
            rank: 1,
            status: "selected",
          },
        },
        companyId: input.companyId,
        customerId: input.customerId,
        estateId,
        notes: `${buildOfferSelectionNote(offer.id)}; source:portal_plot_selection`,
        status: "approved",
        submittedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    await tx.plotStatusHistory.create({
      data: {
        actorCustomerId: input.customerId,
        fromStatus: "available",
        metadataJson: {
          customerOfferId: offer.id,
          plotReservationId: reservation.id,
          source: "portal_plot_selection",
        },
        plotId: input.plotId,
        reason: "Customer selected preferred plot from accepted offer.",
        toStatus: "reserved",
      },
    });

    return { plotId: input.plotId, reservationId: reservation.id };
  });
}
