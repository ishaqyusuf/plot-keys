import type { Prisma } from "../generated/prisma/client";
import {
  EmployeeStatus as EmployeeStatusEnum,
  EmploymentType as EmploymentTypeEnum,
  type WorkRole,
  WorkRole as WorkRoleEnum,
} from "../generated/prisma/enums";
import { createPrismaClient, type Db } from "../prisma";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

export type EmployeeEmploymentTypeValue =
  | "full_time"
  | "part_time"
  | "contract"
  | "intern";

export type EmployeeStatusValue =
  | "active"
  | "on_leave"
  | "suspended"
  | "terminated";

export type EmployeeMutationResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" };

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
    workRole?: WorkRole | null;
    departmentId?: string | null;
    agentId?: string | null;
    employmentType?: EmployeeEmploymentTypeValue;
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
      workRole: input.workRole ?? "operations",
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

export async function createCompanyEmployee(input: {
  companyId: string;
  departmentId?: string | null;
  email?: string | null;
  employmentType?: EmployeeEmploymentTypeValue;
  name: string;
  phone?: string | null;
  salaryAmount?: number | null;
  startDate?: Date | null;
  title?: string | null;
  workRole?: WorkRole | null;
}): Promise<EmployeeMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await createEmployee(db, input);

  return { ok: true };
}

export async function listEmployeesForCompany(
  db: Db,
  companyId: string,
  options: {
    cursor?: string | number | null;
    departmentId?: string;
    end?: string | null;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    start?: string | null;
    status?: EmployeeStatusValue;
    take?: number;
  } = {},
) {
  const query = options.q?.trim();
  const endDate = parseDateBoundary(options.end, "end");
  const searchFilters = query ? getEmployeeSearchFilters(query) : [];
  const size = normalizeListPageSize(options.size ?? options.take, {
    maxSize: 200,
  });
  const offset = normalizeListOffsetCursor(options.cursor);
  const startDate = parseDateBoundary(options.start, "start");
  const startDateFilter: Prisma.DateTimeNullableFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;
  const where: Prisma.EmployeeWhereInput = {
    companyId,
    deletedAt: null,
    ...(options.departmentId ? { departmentId: options.departmentId } : {}),
    ...(startDateFilter ? { startDate: startDateFilter } : {}),
    ...(options.status ? { status: options.status } : {}),
    ...(query
      ? {
          OR: searchFilters,
        }
      : {}),
  };

  const [count, data] = await db.$transaction([
    db.employee.count({ where }),
    db.employee.findMany({
      include: {
        department: { select: { id: true, name: true } },
      },
      orderBy: getEmployeeOrderBy(options.sort),
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

function getEmployeeSearchFilters(query: string): Prisma.EmployeeWhereInput[] {
  const filters: Prisma.EmployeeWhereInput[] = [
    { name: { contains: query, mode: "insensitive" } },
    { title: { contains: query, mode: "insensitive" } },
    { email: { contains: query, mode: "insensitive" } },
    { phone: { contains: query, mode: "insensitive" } },
    {
      department: {
        is: { name: { contains: query, mode: "insensitive" } },
      },
    },
  ];

  if (isEmployeeStatusValue(query)) {
    filters.push({ status: { equals: query } });
  }

  if (isWorkRoleValue(query)) {
    filters.push({ workRole: { equals: query } });
  }

  if (isEmployeeEmploymentTypeValue(query)) {
    filters.push({ employmentType: { equals: query } });
  }

  return filters;
}

function getEmployeeOrderBy(
  sort: string[] | null | undefined,
): Prisma.EmployeeOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { name: "asc" };
  }

  switch (field) {
    case "createdAt":
      return { createdAt: direction };
    case "department":
      return { department: { name: direction } };
    case "email":
      return { email: direction };
    case "employmentType":
      return { employmentType: direction };
    case "name":
      return { name: direction };
    case "status":
      return { status: direction };
    case "title":
      return { title: direction };
    case "workRole":
      return { workRole: direction };
    default:
      return { name: "asc" };
  }
}

function isEmployeeStatusValue(value: string): value is EmployeeStatusValue {
  return Object.values(EmployeeStatusEnum).includes(
    value as EmployeeStatusValue,
  );
}

function isEmployeeEmploymentTypeValue(
  value: string,
): value is EmployeeEmploymentTypeValue {
  return Object.values(EmploymentTypeEnum).includes(
    value as EmployeeEmploymentTypeValue,
  );
}

function isWorkRoleValue(value: string): value is WorkRole {
  return Object.values(WorkRoleEnum).includes(value as WorkRole);
}

export async function listEmployeeExportRows(db: Db, companyId: string) {
  return db.employee.findMany({
    include: { department: { select: { name: true } } },
    orderBy: { name: "asc" },
    where: { companyId, deletedAt: null },
  });
}

export type EmployeeExportRows = Awaited<
  ReturnType<typeof listEmployeeExportRows>
>;

export type EmployeeExportRowsResult =
  | { data: EmployeeExportRows; ok: true }
  | { ok: false; reason: "database-unavailable" };

export async function getEmployeeExportRows(
  companyId: string,
): Promise<EmployeeExportRowsResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  return { data: await listEmployeeExportRows(db, companyId), ok: true };
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
    workRole?: WorkRole | null;
    departmentId?: string | null;
    agentId?: string | null;
    employmentType?: EmployeeEmploymentTypeValue;
    status?: EmployeeStatusValue;
    startDate?: Date | null;
    probationEndDate?: Date | null;
    salaryAmount?: number | null;
    salaryCurrency?: string | null;
  },
) {
  const { workRole, ...rest } = data;
  const updateData: Prisma.EmployeeUncheckedUpdateManyInput = {
    ...rest,
    ...(workRole ? { workRole } : {}),
  };

  const result = await db.employee.updateMany({
    where: { id: employeeId, companyId, deletedAt: null },
    data: updateData,
  });

  if (result.count === 0) {
    return null;
  }

  return getEmployeeById(db, employeeId, companyId);
}

export async function updateCompanyEmployee(input: {
  companyId: string;
  employeeId: string;
  data: {
    departmentId?: string | null;
    email?: string | null;
    employmentType?: EmployeeEmploymentTypeValue;
    name?: string;
    phone?: string | null;
    status?: EmployeeStatusValue;
    title?: string | null;
    workRole?: WorkRole | null;
  };
}): Promise<EmployeeMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await updateEmployee(db, input.employeeId, input.companyId, input.data);

  return { ok: true };
}

export async function softDeleteEmployee(
  db: Db,
  employeeId: string,
  companyId: string,
) {
  return db.employee.updateMany({
    where: { id: employeeId, companyId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
}

export async function deleteCompanyEmployee(input: {
  companyId: string;
  employeeId: string;
}): Promise<EmployeeMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await softDeleteEmployee(db, input.employeeId, input.companyId);

  return { ok: true };
}

export async function countEmployeesByStatus(db: Db, companyId: string) {
  const rows = await db.employee.groupBy({
    by: ["status"],
    where: { companyId, deletedAt: null },
    _count: true,
  });

  return {
    active: rows.find((row) => row.status === "active")?._count ?? 0,
    on_leave: rows.find((row) => row.status === "on_leave")?._count ?? 0,
    suspended: rows.find((row) => row.status === "suspended")?._count ?? 0,
    terminated: rows.find((row) => row.status === "terminated")?._count ?? 0,
    total: rows.reduce((sum, row) => sum + row._count, 0),
  };
}

export async function countEmployeesByDepartment(db: Db, companyId: string) {
  return db.employee.groupBy({
    by: ["departmentId"],
    where: { companyId, deletedAt: null },
    _count: { id: true },
  });
}
