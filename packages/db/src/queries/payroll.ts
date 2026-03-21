import type { Db } from "../prisma";

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

export async function listPayrollForPeriod(
  db: Db,
  companyId: string,
  periodYear: number,
  periodMonth: number,
) {
  return db.payrollEntry.findMany({
    where: { companyId, periodYear, periodMonth },
    include: {
      employee: {
        select: { id: true, name: true, title: true, departmentId: true },
      },
    },
    orderBy: { employee: { name: "asc" } },
  });
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
