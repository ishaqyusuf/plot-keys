import type { Prisma } from "../generated/prisma/client";
import {
  AppointmentStatus as AppointmentStatusEnum,
  type AppointmentStatus as AppointmentStatusValue,
} from "../generated/prisma/enums";
import { createPrismaClient, type Db } from "../prisma";

export async function createAppointment(
  db: Db,
  data: {
    agentId?: string;
    companyId: string;
    durationMin?: number;
    email: string;
    leadId?: string;
    location?: string;
    name: string;
    notes?: string;
    phone?: string;
    propertyId?: string;
    scheduledAt: Date;
  },
) {
  return db.appointment.create({
    data: {
      agentId: data.agentId,
      companyId: data.companyId,
      durationMin: data.durationMin ?? 30,
      email: data.email,
      leadId: data.leadId,
      location: data.location,
      name: data.name,
      notes: data.notes,
      phone: data.phone,
      propertyId: data.propertyId,
      scheduledAt: data.scheduledAt,
    },
  });
}

export async function listAppointmentsForCompany(
  db: Db,
  companyId: string,
  options?: {
    cursor?: string | number | null;
    limit?: number;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    status?: AppointmentStatusValue;
    upcoming?: boolean;
  },
) {
  const query = options?.q?.trim();
  const size = normalizePageSize(options?.size ?? options?.limit);
  const offset = normalizeCursor(options?.cursor);
  const where: Prisma.AppointmentWhereInput = {
    companyId,
    ...(options?.status ? { status: options.status } : {}),
    ...(options?.upcoming ? { scheduledAt: { gte: new Date() } } : {}),
    ...(query ? { OR: getAppointmentSearchFilters(query) } : {}),
  };

  const [count, data] = await db.$transaction([
    db.appointment.count({ where }),
    db.appointment.findMany({
      include: {
        agent: { select: { id: true, name: true } },
        lead: { select: { id: true, name: true } },
        property: { select: { id: true, title: true } },
      },
      orderBy: getAppointmentOrderBy(options?.sort),
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

function getAppointmentSearchFilters(
  query: string,
): Prisma.AppointmentWhereInput[] {
  const filters: Prisma.AppointmentWhereInput[] = [
    { name: { contains: query, mode: "insensitive" } },
    { email: { contains: query, mode: "insensitive" } },
    { phone: { contains: query, mode: "insensitive" } },
    { location: { contains: query, mode: "insensitive" } },
    { notes: { contains: query, mode: "insensitive" } },
    { agent: { is: { name: { contains: query, mode: "insensitive" } } } },
    { lead: { is: { name: { contains: query, mode: "insensitive" } } } },
    { property: { is: { title: { contains: query, mode: "insensitive" } } } },
  ];

  if (isAppointmentStatusValue(query)) {
    filters.push({ status: { equals: query } });
  }

  return filters;
}

function getAppointmentOrderBy(
  sort: string[] | null | undefined,
): Prisma.AppointmentOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { scheduledAt: "asc" };
  }

  switch (field) {
    case "agent":
      return { agent: { name: direction } };
    case "createdAt":
      return { createdAt: direction };
    case "name":
      return { name: direction };
    case "notes":
      return { notes: direction };
    case "scheduledAt":
      return { scheduledAt: direction };
    case "status":
      return { status: direction };
    default:
      return { scheduledAt: "asc" };
  }
}

function isAppointmentStatusValue(
  value: string,
): value is AppointmentStatusValue {
  return Object.values(AppointmentStatusEnum).includes(
    value as AppointmentStatusValue,
  );
}

export async function listAppointmentExportRows(db: Db, companyId: string) {
  return db.appointment.findMany({
    include: {
      agent: { select: { name: true } },
      property: { select: { title: true } },
    },
    orderBy: { scheduledAt: "desc" },
    where: { companyId },
  });
}

export type AppointmentExportRows = Awaited<
  ReturnType<typeof listAppointmentExportRows>
>;

export type AppointmentExportRowsResult =
  | { data: AppointmentExportRows; ok: true }
  | { ok: false; reason: "database-unavailable" };

export async function getAppointmentExportRows(
  companyId: string,
): Promise<AppointmentExportRowsResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  return { data: await listAppointmentExportRows(db, companyId), ok: true };
}

export async function updateAppointmentStatus(
  db: Db,
  data: {
    appointmentId: string;
    notes?: string;
    status: "pending" | "confirmed" | "completed" | "cancelled";
  },
) {
  return db.appointment.update({
    data: {
      notes: data.notes,
      status: data.status,
    },
    where: { id: data.appointmentId },
  });
}

export async function deleteAppointment(db: Db, appointmentId: string) {
  return db.appointment.delete({ where: { id: appointmentId } });
}

export async function countAppointmentsByStatus(db: Db, companyId: string) {
  return db.appointment.groupBy({
    by: ["status"],
    _count: true,
    where: { companyId },
  });
}

export async function findAppointmentById(db: Db, appointmentId: string) {
  return db.appointment.findUnique({
    include: {
      agent: { select: { id: true, name: true } },
      lead: { select: { id: true, name: true, email: true } },
      property: { select: { id: true, title: true } },
    },
    where: { id: appointmentId },
  });
}
