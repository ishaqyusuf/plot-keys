import type { Prisma } from "../generated/prisma/client";
import {
  LeaveRequestStatus as LeaveRequestStatusEnum,
  type LeaveRequestStatus as LeaveRequestStatusValue,
  LeaveType as LeaveTypeEnum,
  type LeaveType as LeaveTypeValue,
} from "../generated/prisma/enums";
import { createPrismaClient, type Db } from "../prisma";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

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

export async function createLeaveRequestForCompany(
  db: Db,
  input: {
    companyId: string;
    employeeId: string;
    endDate: Date;
    leaveType: LeaveTypeValue;
    reason?: string | null;
    startDate: Date;
  },
) {
  const employee = await db.employee.findFirst({
    select: { id: true },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: input.employeeId,
    },
  });

  if (!employee) {
    return null;
  }

  return createLeaveRequest(db, {
    employeeId: input.employeeId,
    endDate: input.endDate,
    leaveType: input.leaveType,
    reason: input.reason,
    startDate: input.startDate,
  });
}

export async function listLeaveRequestsForCompany(
  db: Db,
  companyId: string,
  options: {
    cursor?: string | number | null;
    employeeId?: string;
    end?: string | null;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    start?: string | null;
    status?: LeaveRequestStatusValue;
    take?: number;
  } = {},
) {
  const query = options.q?.trim();
  const endDate = parseDateBoundary(options.end, "end");
  const size = normalizeListPageSize(options.size ?? options.take);
  const offset = normalizeListOffsetCursor(options.cursor);
  const startDate = parseDateBoundary(options.start, "start");
  const dateFilters: Prisma.LeaveRequestWhereInput[] = [
    ...(endDate ? [{ startDate: { lte: endDate } }] : []),
    ...(startDate ? [{ endDate: { gte: startDate } }] : []),
  ];
  const where: Prisma.LeaveRequestWhereInput = {
    employee: { companyId, deletedAt: null },
    ...(dateFilters.length > 0 ? { AND: dateFilters } : {}),
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

export async function rejectLeaveRequest(db: Db, leaveRequestId: string) {
  return db.leaveRequest.update({
    where: { id: leaveRequestId },
    data: { status: "rejected" },
  });
}

export async function cancelLeaveRequest(db: Db, leaveRequestId: string) {
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

export type CompanyLeaveRequestsStatusInput =
  | {
      approvedById: string;
      companyId: string;
      leaveRequestIds: string[];
      status: "approved";
    }
  | {
      companyId: string;
      leaveRequestIds: string[];
      status: "cancelled" | "rejected";
    };

function getLeaveRequestStatusData(
  input: Pick<CompanyLeaveRequestStatusInput, "status"> & {
    approvedById?: string;
  },
) {
  if (input.status === "approved") {
    return {
      approvedAt: new Date(),
      approvedById: input.approvedById,
      status: input.status,
    };
  }

  return { status: input.status };
}

export async function setLeaveRequestStatusForCompany(
  db: Db,
  input: CompanyLeaveRequestStatusInput,
) {
  return db.leaveRequest.updateMany({
    data: getLeaveRequestStatusData(input),
    where: {
      employee: {
        companyId: input.companyId,
        deletedAt: null,
      },
      id: input.leaveRequestId,
    },
  });
}

export async function setLeaveRequestsStatusForCompany(
  db: Db,
  input: CompanyLeaveRequestsStatusInput,
) {
  return db.leaveRequest.updateMany({
    data: getLeaveRequestStatusData(input),
    where: {
      employee: {
        companyId: input.companyId,
        deletedAt: null,
      },
      id: { in: input.leaveRequestIds },
    },
  });
}

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

export async function countLeaveRequestsByStatus(db: Db, companyId: string) {
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
