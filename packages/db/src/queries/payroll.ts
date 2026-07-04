import type { Prisma } from "../generated/prisma/client";
import {
  PayrollStatus as PayrollStatusEnum,
  type PayrollStatus as PayrollStatusValue,
} from "../generated/prisma/enums";
import { createPrismaClient, type Db } from "../prisma";

export type PayrollMutationResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" | "employee-not-found" };

export type PayrollPaidMutationResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" };

// ---------------------------------------------------------------------------
// Payroll Entry CRUD
// ---------------------------------------------------------------------------

export async function createPayrollEntry(
  db: Db,
  input: {
    companyId: string;
    employeeId: string;
    periodYear: number;
    periodMonth: number;
    grossAmount: number;
    netAmount: number;
    currency?: string;
    notes?: string | null;
  },
) {
  return db.payrollEntry.create({
    data: {
      companyId: input.companyId,
      employeeId: input.employeeId,
      periodYear: input.periodYear,
      periodMonth: input.periodMonth,
      grossAmount: input.grossAmount,
      netAmount: input.netAmount,
      currency: input.currency ?? "NGN",
      notes: input.notes ?? null,
    },
  });
}

export async function createCompanyPayrollEntry(input: {
  companyId: string;
  employeeId: string;
  grossAmount: number;
  netAmount: number;
  notes?: string | null;
  periodMonth: number;
  periodYear: number;
}): Promise<PayrollMutationResult> {
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

  await createPayrollEntry(db, input);

  return { ok: true };
}

export async function listPayrollForPeriod(
  db: Db,
  companyId: string,
  periodYear: number,
  periodMonth: number,
  options: {
    cursor?: string | number | null;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
  } = {},
) {
  const query = options.q?.trim();
  const size = normalizePageSize(options.size);
  const offset = normalizeCursor(options.cursor);
  const where: Prisma.PayrollEntryWhereInput = {
    companyId,
    periodYear,
    periodMonth,
    ...(query ? { OR: getPayrollSearchFilters(query) } : {}),
  };

  const [count, data] = await db.$transaction([
    db.payrollEntry.count({ where }),
    db.payrollEntry.findMany({
      include: {
        employee: {
          select: { id: true, name: true, title: true, departmentId: true },
        },
      },
      orderBy: getPayrollOrderBy(options.sort),
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

function getPayrollSearchFilters(
  query: string,
): Prisma.PayrollEntryWhereInput[] {
  const filters: Prisma.PayrollEntryWhereInput[] = [
    { currency: { contains: query, mode: "insensitive" } },
    { notes: { contains: query, mode: "insensitive" } },
    { employee: { is: { name: { contains: query, mode: "insensitive" } } } },
    { employee: { is: { title: { contains: query, mode: "insensitive" } } } },
  ];

  if (isPayrollStatusValue(query)) {
    filters.push({ status: { equals: query } });
  }

  return filters;
}

function getPayrollOrderBy(
  sort: string[] | null | undefined,
): Prisma.PayrollEntryOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { employee: { name: "asc" } };
  }

  switch (field) {
    case "createdAt":
      return { createdAt: direction };
    case "currency":
      return { currency: direction };
    case "employee":
      return { employee: { name: direction } };
    case "grossAmount":
      return { grossAmount: direction };
    case "netAmount":
      return { netAmount: direction };
    case "notes":
      return { notes: direction };
    case "status":
      return { status: direction };
    default:
      return { employee: { name: "asc" } };
  }
}

function isPayrollStatusValue(value: string): value is PayrollStatusValue {
  return Object.values(PayrollStatusEnum).includes(
    value as PayrollStatusValue,
  );
}

export async function markPayrollPaid(
  db: Db,
  payrollEntryId: string,
  companyId: string,
) {
  return db.payrollEntry.update({
    where: { id: payrollEntryId, companyId },
    data: { status: "paid", paidAt: new Date() },
  });
}

export async function markCompanyPayrollPaid(input: {
  companyId: string;
  payrollEntryId: string;
}): Promise<PayrollPaidMutationResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await markPayrollPaid(db, input.payrollEntryId, input.companyId);

  return { ok: true };
}

export async function getPayrollSummaryForPeriod(
  db: Db,
  companyId: string,
  periodYear: number,
  periodMonth: number,
) {
  const entries = await db.payrollEntry.findMany({
    where: { companyId, periodYear, periodMonth },
    select: { grossAmount: true, netAmount: true, status: true },
  });

  let totalGross = 0;
  let totalNet = 0;
  let pendingCount = 0;
  let paidCount = 0;

  for (const e of entries) {
    totalGross += e.grossAmount;
    totalNet += e.netAmount;
    if (e.status === "pending") pendingCount++;
    else paidCount++;
  }

  return {
    totalEntries: entries.length,
    totalGross,
    totalNet,
    pendingCount,
    paidCount,
  };
}

export async function getAvailablePayrollPeriods(
  db: Db,
  companyId: string,
) {
  const rows = await db.payrollEntry.findMany({
    where: { companyId },
    select: { periodYear: true, periodMonth: true },
    distinct: ["periodYear", "periodMonth"],
    orderBy: [{ periodYear: "desc" }, { periodMonth: "desc" }],
    take: 24,
  });

  return rows;
}
