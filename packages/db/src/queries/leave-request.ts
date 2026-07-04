import type { Prisma } from "../generated/prisma/client";
import {
  LeaveRequestStatus as LeaveRequestStatusEnum,
  LeaveType as LeaveTypeEnum,
  type LeaveRequestStatus as LeaveRequestStatusValue,
  type LeaveType as LeaveTypeValue,
} from "../generated/prisma/enums";
import { createPrismaClient, type Db } from "../prisma";

export type CreateCompanyLeaveRequestResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" | "employee-not-found" };

export type LeaveRequestStatusResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" | "leave-request-not-found" };

// ---------------------------------------------------------------------------
// Leave Request CRUD
// ---------------------------------------------------------------------------

export async function createLeaveRequest(
  db: Db,
  input: {
    employeeId: string;
    leaveType: LeaveTypeValue;
    startDate: Date;
    endDate: Date;
    reason?: string | null;
  },
) {
  return db.leaveRequest.create({
    data: {
      employeeId: input.employeeId,
      leaveType: input.leaveType,
      startDate: input.startDate,
      endDate: input.endDate,
      reason: input.reason ?? null,
    },
  });
}

export async function createCompanyLeaveRequest(input: {
  companyId: string;
  employeeId: string;
  endDate: Date;
  leaveType: LeaveTypeValue;
  reason?: string | null;
  startDate: Date;
}): Promise<CreateCompanyLeaveRequestResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const employee = await db.employee.findFirst({
    select: { id: true },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.employeeId,
    },
  });

  if (!employee) {
    return { ok: false, reason: "employee-not-found" };
  }

  await createLeaveRequest(db, {
    employeeId: input.employeeId,
    endDate: input.endDate,
    leaveType: input.leaveType,
    reason: input.reason,
    startDate: input.startDate,
  });

  return { ok: true };
}

export async function listLeaveRequestsForCompany(
  db: Db,
  companyId: string,
  options: {
    cursor?: string | number | null;
    employeeId?: string;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    status?: LeaveRequestStatusValue;
    take?: number;
  } = {},
) {
  const query = options.q?.trim();
  const size = normalizePageSize(options.size ?? options.take);
  const offset = normalizeCursor(options.cursor);
  const where: Prisma.LeaveRequestWhereInput = {
    employee: { companyId, deletedAt: null },
    ...(options.status ? { status: options.status } : {}),
    ...(options.employeeId ? { employeeId: options.employeeId } : {}),
    ...(query ? { OR: getLeaveRequestSearchFilters(query) } : {}),
  };

  const [count, data] = await db.$transaction([
    db.leaveRequest.count({ where }),
    db.leaveRequest.findMany({
      include: {
        employee: { select: { id: true, name: true, title: true } },
      },
      orderBy: getLeaveRequestOrderBy(options.sort),
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

function getLeaveRequestSearchFilters(
  query: string,
): Prisma.LeaveRequestWhereInput[] {
  const filters: Prisma.LeaveRequestWhereInput[] = [
    {
      employee: { is: { name: { contains: query, mode: "insensitive" } } },
    },
    {
      employee: { is: { title: { contains: query, mode: "insensitive" } } },
    },
    { reason: { contains: query, mode: "insensitive" } },
  ];

  if (isLeaveRequestStatusValue(query)) {
    filters.push({ status: { equals: query } });
  }

  if (isLeaveTypeValue(query)) {
    filters.push({ leaveType: { equals: query } });
  }

  return filters;
}

function getLeaveRequestOrderBy(
  sort: string[] | null | undefined,
): Prisma.LeaveRequestOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { createdAt: "desc" };
  }

  switch (field) {
    case "createdAt":
      return { createdAt: direction };
    case "employee":
      return { employee: { name: direction } };
    case "endDate":
      return { endDate: direction };
    case "leaveType":
      return { leaveType: direction };
    case "reason":
      return { reason: direction };
    case "startDate":
      return { startDate: direction };
    case "status":
      return { status: direction };
    default:
      return { createdAt: "desc" };
  }
}

function isLeaveRequestStatusValue(
  value: string,
): value is LeaveRequestStatusValue {
  return Object.values(LeaveRequestStatusEnum).includes(
    value as LeaveRequestStatusValue,
  );
}

function isLeaveTypeValue(value: string): value is LeaveTypeValue {
  return Object.values(LeaveTypeEnum).includes(value as LeaveTypeValue);
}

export async function approveLeaveRequest(
  db: Db,
  leaveRequestId: string,
  approvedById: string,
) {
  return db.leaveRequest.update({
    where: { id: leaveRequestId },
    data: {
      status: "approved",
      approvedById,
      approvedAt: new Date(),
    },
  });
}

export async function rejectLeaveRequest(
  db: Db,
  leaveRequestId: string,
) {
  return db.leaveRequest.update({
    where: { id: leaveRequestId },
    data: { status: "rejected" },
  });
}

export async function cancelLeaveRequest(
  db: Db,
  leaveRequestId: string,
) {
  return db.leaveRequest.update({
    where: { id: leaveRequestId },
    data: { status: "cancelled" },
  });
}

export type CompanyLeaveRequestStatusInput =
  | {
      approvedById: string;
      companyId: string;
      leaveRequestId: string;
      status: "approved";
    }
  | {
      companyId: string;
      leaveRequestId: string;
      status: "cancelled" | "rejected";
    };

export async function setCompanyLeaveRequestStatus(
  input: CompanyLeaveRequestStatusInput,
): Promise<LeaveRequestStatusResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const request = await db.leaveRequest.findFirst({
    select: { id: true },
    where: {
      employee: { companyId: input.companyId },
      id: input.leaveRequestId,
    },
  });

  if (!request) {
    return { ok: false, reason: "leave-request-not-found" };
  }

  if (input.status === "approved") {
    await approveLeaveRequest(db, input.leaveRequestId, input.approvedById);
  } else if (input.status === "rejected") {
    await rejectLeaveRequest(db, input.leaveRequestId);
  } else {
    await cancelLeaveRequest(db, input.leaveRequestId);
  }

  return { ok: true };
}

export async function countLeaveRequestsByStatus(
  db: Db,
  companyId: string,
) {
  const rows = await db.leaveRequest.groupBy({
    by: ["status"],
    _count: true,
    where: {
      employee: { companyId, deletedAt: null },
    },
  });

  return {
    approved: rows.find((row) => row.status === "approved")?._count ?? 0,
    cancelled: rows.find((row) => row.status === "cancelled")?._count ?? 0,
    pending: rows.find((row) => row.status === "pending")?._count ?? 0,
    rejected: rows.find((row) => row.status === "rejected")?._count ?? 0,
    total: rows.reduce((sum, row) => sum + row._count, 0),
  };
}
