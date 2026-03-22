import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Budget CRUD
// ---------------------------------------------------------------------------

export async function getProjectBudget(db: Db, projectId: string) {
  return db.projectBudget.findUnique({
    where: { projectId },
    include: {
      lineItems: {
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function upsertProjectBudget(
  db: Db,
  input: {
    projectId: string;
    currency?: string;
    approvedBudgetMinor?: number;
    forecastBudgetMinor?: number;
    actualBudgetMinor?: number;
  },
) {
  return db.projectBudget.upsert({
    where: { projectId: input.projectId },
    update: {
      ...(input.currency !== undefined ? { currency: input.currency } : {}),
      ...(input.approvedBudgetMinor !== undefined
        ? { approvedBudgetMinor: input.approvedBudgetMinor }
        : {}),
      ...(input.forecastBudgetMinor !== undefined
        ? { forecastBudgetMinor: input.forecastBudgetMinor }
        : {}),
      ...(input.actualBudgetMinor !== undefined
        ? { actualBudgetMinor: input.actualBudgetMinor }
        : {}),
    },
    create: {
      projectId: input.projectId,
      currency: input.currency ?? "NGN",
      approvedBudgetMinor: input.approvedBudgetMinor ?? 0,
      forecastBudgetMinor: input.forecastBudgetMinor ?? 0,
      actualBudgetMinor: input.actualBudgetMinor ?? 0,
    },
  });
}

// ---------------------------------------------------------------------------
// Budget Line Items
// ---------------------------------------------------------------------------

export async function createBudgetLineItem(
  db: Db,
  input: {
    budgetId: string;
    category?:
      | "preliminaries"
      | "substructure"
      | "superstructure"
      | "mep"
      | "finishing"
      | "external_works"
      | "contingency"
      | "professional_fees"
      | "other";
    description: string;
    quantity?: number | null;
    unitRateMinor?: number | null;
    estimatedMinor?: number;
    actualMinor?: number;
    notes?: string | null;
  },
) {
  return db.projectBudgetLineItem.create({
    data: {
      budgetId: input.budgetId,
      category: input.category ?? "other",
      description: input.description,
      quantity: input.quantity ?? null,
      unitRateMinor: input.unitRateMinor ?? null,
      estimatedMinor: input.estimatedMinor ?? 0,
      actualMinor: input.actualMinor ?? 0,
      notes: input.notes ?? null,
    },
  });
}

export async function updateBudgetLineItem(
  db: Db,
  lineItemId: string,
  data: {
    category?:
      | "preliminaries"
      | "substructure"
      | "superstructure"
      | "mep"
      | "finishing"
      | "external_works"
      | "contingency"
      | "professional_fees"
      | "other";
    description?: string;
    quantity?: number | null;
    unitRateMinor?: number | null;
    estimatedMinor?: number;
    actualMinor?: number;
    notes?: string | null;
  },
) {
  return db.projectBudgetLineItem.update({
    where: { id: lineItemId },
    data,
  });
}

export async function deleteBudgetLineItem(db: Db, lineItemId: string) {
  return db.projectBudgetLineItem.delete({ where: { id: lineItemId } });
}

// ---------------------------------------------------------------------------
// Workers
// ---------------------------------------------------------------------------

export async function listProjectWorkers(
  db: Db,
  projectId: string,
  options: {
    status?: "active" | "inactive" | "terminated";
  } = {},
) {
  return db.projectWorker.findMany({
    where: {
      projectId,
      ...(options.status ? { status: options.status } : {}),
    },
    include: {
      employee: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function createProjectWorker(
  db: Db,
  input: {
    projectId: string;
    employeeId?: string | null;
    fullName: string;
    role?: string | null;
    payBasis?: "daily" | "weekly" | "monthly" | "fixed_contract" | "milestone_based";
    payRateMinor?: number;
  },
) {
  return db.projectWorker.create({
    data: {
      projectId: input.projectId,
      employeeId: input.employeeId ?? null,
      fullName: input.fullName,
      role: input.role ?? null,
      payBasis: input.payBasis ?? "daily",
      payRateMinor: input.payRateMinor ?? 0,
    },
  });
}

export async function updateProjectWorker(
  db: Db,
  workerId: string,
  data: {
    fullName?: string;
    role?: string | null;
    payBasis?: "daily" | "weekly" | "monthly" | "fixed_contract" | "milestone_based";
    payRateMinor?: number;
    status?: "active" | "inactive" | "terminated";
  },
) {
  return db.projectWorker.update({
    where: { id: workerId },
    data,
  });
}

export async function deleteProjectWorker(db: Db, workerId: string) {
  return db.projectWorker.delete({ where: { id: workerId } });
}

// ---------------------------------------------------------------------------
// Payroll Runs
// ---------------------------------------------------------------------------

export async function listProjectPayrollRuns(db: Db, projectId: string) {
  return db.projectPayrollRun.findMany({
    where: { projectId },
    include: {
      _count: { select: { entries: true } },
    },
    orderBy: { periodStart: "desc" },
  });
}

export async function getProjectPayrollRun(db: Db, payrollRunId: string) {
  return db.projectPayrollRun.findUnique({
    where: { id: payrollRunId },
    include: {
      entries: {
        include: {
          worker: {
            select: { id: true, fullName: true, role: true, payBasis: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });
}

export async function createProjectPayrollRun(
  db: Db,
  input: {
    projectId: string;
    periodStart: Date;
    periodEnd: Date;
  },
) {
  return db.projectPayrollRun.create({
    data: {
      projectId: input.projectId,
      periodStart: input.periodStart,
      periodEnd: input.periodEnd,
    },
  });
}

export async function updateProjectPayrollRun(
  db: Db,
  payrollRunId: string,
  data: {
    status?: "draft" | "finalized" | "paid";
    totalGrossMinor?: number;
    totalNetMinor?: number;
  },
) {
  return db.projectPayrollRun.update({
    where: { id: payrollRunId },
    data,
  });
}

// ---------------------------------------------------------------------------
// Payroll Entries
// ---------------------------------------------------------------------------

export async function createProjectPayrollEntry(
  db: Db,
  input: {
    payrollRunId: string;
    workerId: string;
    attendanceUnits?: number | null;
    grossMinor?: number;
    deductionMinor?: number;
    advanceMinor?: number;
    netMinor?: number;
  },
) {
  return db.projectPayrollEntry.create({
    data: {
      payrollRunId: input.payrollRunId,
      workerId: input.workerId,
      attendanceUnits: input.attendanceUnits ?? null,
      grossMinor: input.grossMinor ?? 0,
      deductionMinor: input.deductionMinor ?? 0,
      advanceMinor: input.advanceMinor ?? 0,
      netMinor: input.netMinor ?? 0,
    },
  });
}

export async function updateProjectPayrollEntry(
  db: Db,
  entryId: string,
  data: {
    attendanceUnits?: number | null;
    grossMinor?: number;
    deductionMinor?: number;
    advanceMinor?: number;
    netMinor?: number;
    paymentStatus?: "pending" | "paid" | "on_hold";
  },
) {
  return db.projectPayrollEntry.update({
    where: { id: entryId },
    data,
  });
}

export async function deleteProjectPayrollEntry(db: Db, entryId: string) {
  return db.projectPayrollEntry.delete({ where: { id: entryId } });
}
