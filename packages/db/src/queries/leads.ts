import type { Prisma } from "../generated/prisma/client";
import { createPrismaClient, type Db } from "../prisma";

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
    limit?: number;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    status?: "new" | "contacted" | "qualified" | "closed";
  },
) {
  const query = options?.q?.trim();
  const size = normalizePageSize(options?.size ?? options?.limit);
  const offset = normalizeCursor(options?.cursor);
  const where: Prisma.LeadWhereInput = {
    companyId,
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

function normalizePageSize(size: string | number | null | undefined) {
  const value = Number(size ?? 50);

  if (!Number.isFinite(value)) {
    return 50;
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

export async function updateLeadStatus(
  db: Db,
  input: {
    leadId: string;
    notes?: string;
    status: "new" | "contacted" | "qualified" | "closed";
  },
) {
  return db.lead.update({
    data: {
      notes: input.notes,
      status: input.status,
    },
    where: { id: input.leadId },
  });
}

export async function findLeadById(db: Db, leadId: string) {
  return db.lead.findUnique({ where: { id: leadId } });
}
