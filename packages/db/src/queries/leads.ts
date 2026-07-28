import type { Prisma } from "../generated/prisma/client";
import { createPrismaClient, type Db } from "../prisma";
import { createCustomer } from "./customer";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

export async function createLead(
  db: Db,
  input: {
    companyId: string;
    email: string;
    message?: string;
    name: string;
    phone?: string;
    source?: string;
  },
) {
  return db.lead.create({
    data: {
      companyId: input.companyId,
      email: input.email,
      message: input.message,
      name: input.name,
      phone: input.phone,
      source: input.source ?? "contact_form",
    },
  });
}

export async function listLeadsForCompany(
  db: Db,
  companyId: string,
  options?: {
    cursor?: string | number | null;
    end?: string | null;
    limit?: number;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    start?: string | null;
    status?: "new" | "contacted" | "qualified" | "closed";
  },
) {
  const query = options?.q?.trim();
  const endDate = parseDateBoundary(options?.end, "end");
  const size = normalizeListPageSize(options?.size ?? options?.limit);
  const offset = normalizeListOffsetCursor(options?.cursor);
  const startDate = parseDateBoundary(options?.start, "start");
  const createdAtFilter: Prisma.DateTimeFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;
  const where: Prisma.LeadWhereInput = {
    companyId,
    ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
    ...(options?.status ? { status: options.status } : {}),
    ...(query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
            { phone: { contains: query, mode: "insensitive" } },
            { message: { contains: query, mode: "insensitive" } },
            { source: { contains: query, mode: "insensitive" } },
          ],
        }
      : {}),
  };

  const [count, data] = await db.$transaction([
    db.lead.count({ where }),
    db.lead.findMany({
      orderBy: getLeadOrderBy(options?.sort),
      skip: offset,
      take: size,
      where,
    }),
  ]);
  return createPaginatedListResult(data, { count, offset, size });
}

function parseDateBoundary(
  value: string | null | undefined,
  boundary: "end" | "start",
) {
  if (!value) {
    return null;
  }

  const suffix = boundary === "start" ? "T00:00:00.000Z" : "T23:59:59.999Z";
  const date = new Date(`${value}${suffix}`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getLeadOrderBy(
  sort: string[] | null | undefined,
): Prisma.LeadOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { createdAt: "desc" };
  }

  switch (field) {
    case "createdAt":
      return { createdAt: direction };
    case "name":
      return { name: direction };
    case "source":
      return { source: direction };
    case "status":
      return { status: direction };
    default:
      return { createdAt: "desc" };
  }
}

export async function listLeadExportRows(db: Db, companyId: string) {
  return db.lead.findMany({
    orderBy: { createdAt: "desc" },
    where: { companyId },
  });
}

export type LeadExportRows = Awaited<ReturnType<typeof listLeadExportRows>>;

export type LeadExportRowsResult =
  | { data: LeadExportRows; ok: true }
  | { ok: false; reason: "database-unavailable" };

export async function getLeadExportRows(
  companyId: string,
): Promise<LeadExportRowsResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  return { data: await listLeadExportRows(db, companyId), ok: true };
}

export async function countLeadsByStatus(db: Db, companyId: string) {
  const counts = await db.lead.groupBy({
    by: ["status"],
    _count: true,
    where: { companyId },
  });

  return {
    closed: counts.find((c) => c.status === "closed")?._count ?? 0,
    contacted: counts.find((c) => c.status === "contacted")?._count ?? 0,
    new: counts.find((c) => c.status === "new")?._count ?? 0,
    qualified: counts.find((c) => c.status === "qualified")?._count ?? 0,
    total: counts.reduce((sum, c) => sum + c._count, 0),
  };
}

export async function updateLeadStatusForCompany(
  db: Db,
  input: {
    companyId: string;
    leadId: string;
    notes?: string;
    status: "new" | "contacted" | "qualified" | "closed";
  },
) {
  const result = await db.lead.updateMany({
    data: {
      notes: input.notes,
      status: input.status,
    },
    where: {
      companyId: input.companyId,
      id: input.leadId,
    },
  });

  if (result.count === 0) {
    return null;
  }

  return { id: input.leadId, status: input.status };
}

export async function updateLeadsStatusForCompany(
  db: Db,
  input: {
    companyId: string;
    leadIds: string[];
    status: "new" | "contacted" | "qualified" | "closed";
  },
) {
  const uniqueLeadIds = Array.from(new Set(input.leadIds));
  const leads = await db.lead.findMany({
    select: { id: true },
    where: {
      companyId: input.companyId,
      id: { in: uniqueLeadIds },
    },
  });

  if (leads.length !== uniqueLeadIds.length) {
    return null;
  }

  await db.lead.updateMany({
    data: {
      status: input.status,
    },
    where: {
      companyId: input.companyId,
      id: { in: uniqueLeadIds },
    },
  });

  return { leadIds: uniqueLeadIds, status: input.status };
}

export async function convertLeadToCustomerForCompany(
  db: Db,
  input: { companyId: string; leadId: string },
) {
  const lead = await db.lead.findFirst({
    where: {
      companyId: input.companyId,
      id: input.leadId,
    },
  });

  if (!lead) {
    return null;
  }

  const customer = await createCustomer(db, {
    companyId: input.companyId,
    email: lead.email,
    name: lead.name,
    phone: lead.phone,
    sourceLeadId: lead.id,
    status: "active",
  });
  const updatedLead = await updateLeadStatusForCompany(db, {
    companyId: input.companyId,
    leadId: lead.id,
    status: "qualified",
  });

  if (!updatedLead) {
    return null;
  }

  return {
    customerId: customer.id,
    leadId: updatedLead.id,
    status: updatedLead.status,
  };
}

export async function findLeadById(db: Db, leadId: string) {
  return db.lead.findUnique({ where: { id: leadId } });
}
