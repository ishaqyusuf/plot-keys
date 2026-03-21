import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Employee CRUD
// ---------------------------------------------------------------------------

export async function createEmployee(
  db: Db,
  input: {
    companyId: string;
    name: string;
    email?: string | null;
    phone?: string | null;
    title?: string | null;
    departmentId?: string | null;
    agentId?: string | null;
    employmentType?: "full_time" | "part_time" | "contract" | "intern";
    startDate?: Date | null;
    probationEndDate?: Date | null;
    salaryAmount?: number | null;
    salaryCurrency?: string | null;
  },
) {
  return db.employee.create({
    data: {
      companyId: input.companyId,
      name: input.name,
      email: input.email ?? null,
      phone: input.phone ?? null,
      title: input.title ?? null,
      departmentId: input.departmentId ?? null,
      agentId: input.agentId ?? null,
      employmentType: input.employmentType ?? "full_time",
      startDate: input.startDate ?? null,
      probationEndDate: input.probationEndDate ?? null,
      salaryAmount: input.salaryAmount ?? null,
      salaryCurrency: input.salaryCurrency ?? "NGN",
    },
  });
}

export async function listEmployeesForCompany(
  db: Db,
  companyId: string,
  options: {
    departmentId?: string;
    status?: "active" | "on_leave" | "suspended" | "terminated";
    take?: number;
  } = {},
) {
  return db.employee.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(options.departmentId
        ? { departmentId: options.departmentId }
        : {}),
      ...(options.status ? { status: options.status } : {}),
    },
    include: {
      department: { select: { id: true, name: true } },
    },
    orderBy: { name: "asc" },
    take: options.take ?? 200,
  });
}

export async function getEmployeeById(
  db: Db,
  employeeId: string,
  companyId: string,
) {
  return db.employee.findFirst({
    where: { id: employeeId, companyId, deletedAt: null },
    include: {
      department: { select: { id: true, name: true } },
    },
  });
}

export async function updateEmployee(
  db: Db,
  employeeId: string,
  companyId: string,
  data: {
    name?: string;
    email?: string | null;
    phone?: string | null;
    title?: string | null;
    departmentId?: string | null;
    agentId?: string | null;
    employmentType?: "full_time" | "part_time" | "contract" | "intern";
    status?: "active" | "on_leave" | "suspended" | "terminated";
    startDate?: Date | null;
    probationEndDate?: Date | null;
    salaryAmount?: number | null;
    salaryCurrency?: string | null;
  },
) {
  return db.employee.update({
    where: { id: employeeId, companyId },
    data,
  });
}

export async function softDeleteEmployee(
  db: Db,
  employeeId: string,
  companyId: string,
) {
  return db.employee.update({
    where: { id: employeeId, companyId },
    data: { deletedAt: new Date() },
  });
}

export async function countEmployeesByStatus(db: Db, companyId: string) {
  const rows = await db.employee.groupBy({
    by: ["status"],
    where: { companyId, deletedAt: null },
    _count: { id: true },
  });

  const result: Record<string, number> = {
    active: 0,
    on_leave: 0,
    suspended: 0,
    terminated: 0,
  };
  for (const row of rows) {
    result[row.status] = row._count.id;
  }
  return result;
}

export async function countEmployeesByDepartment(db: Db, companyId: string) {
  return db.employee.groupBy({
    by: ["departmentId"],
    where: { companyId, deletedAt: null },
    _count: { id: true },
  });
}
