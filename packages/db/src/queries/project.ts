import type { Db } from "../prisma";

// ---------------------------------------------------------------------------
// Project CRUD
// ---------------------------------------------------------------------------

export async function createProject(
  db: Db,
  input: {
    companyId: string;
    name: string;
    code?: string | null;
    type?:
      | "building"
      | "estate"
      | "fit_out"
      | "infrastructure"
      | "renovation"
      | null;
    location?: string | null;
    description?: string | null;
    startDate?: Date | null;
    targetCompletionDate?: Date | null;
  },
) {
  return db.project.create({
    data: {
      companyId: input.companyId,
      name: input.name,
      code: input.code ?? null,
      type: input.type ?? null,
      location: input.location ?? null,
      description: input.description ?? null,
      startDate: input.startDate ?? null,
      targetCompletionDate: input.targetCompletionDate ?? null,
    },
  });
}

export async function listProjectsForCompany(
  db: Db,
  companyId: string,
  options: {
    status?:
      | "draft"
      | "active"
      | "paused"
      | "delayed"
      | "completed"
      | "archived";
    take?: number;
  } = {},
) {
  return db.project.findMany({
    where: {
      companyId,
      deletedAt: null,
      ...(options.status ? { status: options.status } : {}),
    },
    include: {
      _count: {
        select: {
          phases: true,
          milestones: true,
          updates: true,
          issues: true,
          assignments: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: options.take ?? 200,
  });
}

export async function getProjectById(
  db: Db,
  projectId: string,
  companyId: string,
) {
  return db.project.findFirst({
    where: { id: projectId, companyId, deletedAt: null },
    include: {
      phases: {
        orderBy: { order: "asc" },
      },
      milestones: {
        orderBy: { dueDate: "asc" },
        include: { phase: { select: { id: true, name: true } } },
      },
      updates: {
        orderBy: { postedAt: "desc" },
        take: 10,
      },
      issues: {
        orderBy: { openedAt: "desc" },
      },
      assignments: {
        where: { status: "active" },
        include: {
          membership: {
            include: {
              user: { select: { id: true, name: true, email: true } },
            },
          },
        },
      },
      _count: {
        select: {
          phases: true,
          milestones: true,
          documents: true,
          updates: true,
          issues: true,
          assignments: true,
        },
      },
    },
  });
}

export async function updateProject(
  db: Db,
  projectId: string,
  companyId: string,
  data: {
    name?: string;
    code?: string | null;
    type?:
      | "building"
      | "estate"
      | "fit_out"
      | "infrastructure"
      | "renovation"
      | null;
    location?: string | null;
    description?: string | null;
    status?:
      | "draft"
      | "active"
      | "paused"
      | "delayed"
      | "completed"
      | "archived";
    startDate?: Date | null;
    targetCompletionDate?: Date | null;
    completedAt?: Date | null;
  },
) {
  return db.project.update({
    where: { id: projectId, companyId },
    data,
  });
}

export async function deleteProject(
  db: Db,
  projectId: string,
  companyId: string,
) {
  return db.project.update({
    where: { id: projectId, companyId },
    data: { deletedAt: new Date() },
  });
}

export async function countProjectsByStatus(db: Db, companyId: string) {
  const rows = await db.project.groupBy({
    by: ["status"],
    _count: { id: true },
    where: { companyId, deletedAt: null },
  });

  const result: Record<string, number> = {
    draft: 0,
    active: 0,
    paused: 0,
    delayed: 0,
    completed: 0,
    archived: 0,
  };
  for (const row of rows) {
    result[row.status] = row._count.id;
  }
  return result;
}

// ---------------------------------------------------------------------------
// Phases
// ---------------------------------------------------------------------------

export async function createProjectPhase(
  db: Db,
  input: {
    projectId: string;
    name: string;
    order?: number;
    startDate?: Date | null;
    endDate?: Date | null;
  },
) {
  return db.projectPhase.create({
    data: {
      projectId: input.projectId,
      name: input.name,
      order: input.order ?? 0,
      startDate: input.startDate ?? null,
      endDate: input.endDate ?? null,
    },
  });
}

export async function updateProjectPhase(
  db: Db,
  phaseId: string,
  data: {
    name?: string;
    order?: number;
    status?: "not_started" | "in_progress" | "completed" | "on_hold";
    startDate?: Date | null;
    endDate?: Date | null;
  },
) {
  return db.projectPhase.update({
    where: { id: phaseId },
    data,
  });
}

export async function deleteProjectPhase(db: Db, phaseId: string) {
  return db.projectPhase.delete({ where: { id: phaseId } });
}

// ---------------------------------------------------------------------------
// Milestones
// ---------------------------------------------------------------------------

export async function createProjectMilestone(
  db: Db,
  input: {
    projectId: string;
    phaseId?: string | null;
    name: string;
    dueDate?: Date | null;
    notes?: string | null;
  },
) {
  return db.projectMilestone.create({
    data: {
      projectId: input.projectId,
      phaseId: input.phaseId ?? null,
      name: input.name,
      dueDate: input.dueDate ?? null,
      notes: input.notes ?? null,
    },
  });
}

export async function updateProjectMilestone(
  db: Db,
  milestoneId: string,
  data: {
    name?: string;
    status?: "pending" | "in_progress" | "completed" | "overdue";
    dueDate?: Date | null;
    completedAt?: Date | null;
    notes?: string | null;
  },
) {
  return db.projectMilestone.update({
    where: { id: milestoneId },
    data,
  });
}

export async function deleteProjectMilestone(db: Db, milestoneId: string) {
  return db.projectMilestone.delete({ where: { id: milestoneId } });
}

// ---------------------------------------------------------------------------
// Updates
// ---------------------------------------------------------------------------

export async function createProjectUpdate(
  db: Db,
  input: {
    projectId: string;
    authorId?: string | null;
    kind?: "daily" | "weekly" | "milestone" | "general";
    summary: string;
    details?: string | null;
    progressPercent?: number | null;
  },
) {
  return db.projectUpdate.create({
    data: {
      projectId: input.projectId,
      authorId: input.authorId ?? null,
      kind: input.kind ?? "general",
      summary: input.summary,
      details: input.details ?? null,
      progressPercent: input.progressPercent ?? null,
    },
  });
}

// ---------------------------------------------------------------------------
// Issues
// ---------------------------------------------------------------------------

export async function createProjectIssue(
  db: Db,
  input: {
    projectId: string;
    title: string;
    description?: string | null;
    severity?: "low" | "medium" | "high" | "critical";
    ownerId?: string | null;
  },
) {
  return db.projectIssue.create({
    data: {
      projectId: input.projectId,
      title: input.title,
      description: input.description ?? null,
      severity: input.severity ?? "medium",
      ownerId: input.ownerId ?? null,
    },
  });
}

export async function updateProjectIssue(
  db: Db,
  issueId: string,
  data: {
    title?: string;
    description?: string | null;
    severity?: "low" | "medium" | "high" | "critical";
    status?: "open" | "in_progress" | "resolved" | "closed";
    ownerId?: string | null;
    closedAt?: Date | null;
  },
) {
  return db.projectIssue.update({
    where: { id: issueId },
    data,
  });
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

export async function assignMemberToProject(
  db: Db,
  input: {
    projectId: string;
    membershipId: string;
    projectRole?:
      | "project_owner"
      | "project_manager"
      | "qs_manager"
      | "finance_reviewer"
      | "site_supervisor"
      | "viewer";
  },
) {
  return db.projectAssignment.upsert({
    where: {
      projectId_membershipId: {
        projectId: input.projectId,
        membershipId: input.membershipId,
      },
    },
    update: {
      projectRole: input.projectRole ?? "viewer",
      status: "active",
    },
    create: {
      projectId: input.projectId,
      membershipId: input.membershipId,
      projectRole: input.projectRole ?? "viewer",
    },
  });
}

export async function removeAssignmentFromProject(
  db: Db,
  assignmentId: string,
) {
  return db.projectAssignment.update({
    where: { id: assignmentId },
    data: { status: "removed" },
  });
}

// ---------------------------------------------------------------------------
// Documents
// ---------------------------------------------------------------------------

export async function listProjectDocuments(db: Db, projectId: string) {
  return db.projectDocument.findMany({
    where: { projectId },
    orderBy: { createdAt: "desc" },
  });
}

export async function createProjectDocument(
  db: Db,
  input: {
    projectId: string;
    kind?:
      | "drawing"
      | "contract"
      | "permit"
      | "invoice"
      | "receipt"
      | "site_report"
      | "inspection"
      | "handover"
      | "other";
    title: string;
    fileUrl: string;
    visibility?: "internal" | "shared";
    versionLabel?: string | null;
    uploadedById?: string | null;
  },
) {
  return db.projectDocument.create({
    data: {
      projectId: input.projectId,
      kind: input.kind ?? "other",
      title: input.title,
      fileUrl: input.fileUrl,
      visibility: input.visibility ?? "internal",
      versionLabel: input.versionLabel ?? null,
      uploadedById: input.uploadedById ?? null,
    },
  });
}

// ---------------------------------------------------------------------------
// Budget
// ---------------------------------------------------------------------------

export async function getOrCreateProjectBudget(db: Db, projectId: string) {
  const existing = await db.projectBudget.findUnique({ where: { projectId } });
  if (existing) return existing;
  return db.projectBudget.create({
    data: { projectId },
  });
}

export async function updateProjectBudget(
  db: Db,
  budgetId: string,
  data: {
    approvedBudgetMinor?: number;
    forecastBudgetMinor?: number;
    actualBudgetMinor?: number;
    currency?: string;
    notes?: string | null;
  },
) {
  return db.projectBudget.update({ where: { id: budgetId }, data });
}

export async function getProjectBudgetWithLineItems(db: Db, projectId: string) {
  return db.projectBudget.findUnique({
    where: { projectId },
    include: {
      lineItems: { orderBy: { createdAt: "asc" } },
    },
  });
}

export async function createProjectBudgetLineItem(
  db: Db,
  input: {
    projectId: string;
    budgetId: string;
    category:
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
      category: input.category,
      description: input.description,
      quantity: input.quantity ?? null,
      unitRateMinor: input.unitRateMinor ?? null,
      estimatedMinor: input.estimatedMinor ?? 0,
      actualMinor: input.actualMinor ?? 0,
      notes: input.notes ?? null,
    },
  });
}

export async function updateProjectBudgetLineItem(
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
  return db.projectBudgetLineItem.update({ where: { id: lineItemId }, data });
}

export async function deleteProjectBudgetLineItem(db: Db, lineItemId: string) {
  return db.projectBudgetLineItem.delete({ where: { id: lineItemId } });
}
