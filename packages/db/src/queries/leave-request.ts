import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Leave Request CRUD
// ---------------------------------------------------------------------------

export async function createLeaveRequest(
  db: Db,
  input: {
    employeeId: string;
    leaveType: "annual" | "sick" | "maternity" | "paternity" | "unpaid" | "compassionate";
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

export async function listLeaveRequestsForCompany(
  db: Db,
  companyId: string,
  options: {
    status?: "pending" | "approved" | "rejected" | "cancelled";
    employeeId?: string;
    take?: number;
  } = {},
) {
  return db.leaveRequest.findMany({
    where: {
      employee: { companyId, deletedAt: null },
      ...(options.status ? { status: options.status } : {}),
      ...(options.employeeId ? { employeeId: options.employeeId } : {}),
    },
    include: {
      employee: { select: { id: true, name: true, title: true } },
    },
    orderBy: { createdAt: "desc" },
    take: options.take ?? 200,
  });
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

export async function countLeaveRequestsByStatus(
  db: Db,
  companyId: string,
) {
  const rows = await db.leaveRequest.groupBy({
    by: ["status"],
    _count: { id: true },
    where: {
      employee: { companyId, deletedAt: null },
    },
  });

  const result: Record<string, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };
  for (const row of rows) {
    result[row.status] = row._count.id;
  }
  return result;
}
