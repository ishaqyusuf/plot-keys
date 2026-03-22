import {
  assignMemberToProject,
  countProjectsByStatus,
  createBudgetLineItem,
  createProject,
  createProjectCustomerNotice,
  createProjectIssue,
  createProjectMilestone,
  createProjectPayrollEntry,
  createProjectPayrollRun,
  createProjectPhase,
  createProjectUpdate,
  createProjectWorker,
  deleteBudgetLineItem,
  deleteProject,
  deleteProjectCustomerNotice,
  deleteProjectWorker,
  getProjectBudget,
  getProjectById,
  getProjectPayrollRun,
  grantCustomerProjectAccess,
  listCustomerAccessForProject,
  listProjectPayrollRuns,
  listProjectsForCompany,
  listProjectWorkers,
  removeAssignmentFromProject,
  revokeCustomerProjectAccess,
  toggleMilestoneCustomerVisibility,
  toggleUpdateCustomerVisibility,
  updateBudgetLineItem,
  updateProject,
  updateProjectIssue,
  updateProjectMilestone,
  updateProjectPayrollEntry,
  updateProjectPayrollRun,
  updateProjectPhase,
  updateProjectWorker,
  upsertProjectBudget,
} from "@plotkeys/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, membershipProcedure } from "../lib.trpc";

// ---------------------------------------------------------------------------
// Shared enum schemas
// ---------------------------------------------------------------------------

const projectStatusEnum = z.enum([
  "draft",
  "active",
  "paused",
  "delayed",
  "completed",
  "archived",
]);
const projectTypeEnum = z.enum([
  "building",
  "estate",
  "fit_out",
  "infrastructure",
  "renovation",
]);
const phaseStatusEnum = z.enum([
  "not_started",
  "in_progress",
  "completed",
  "on_hold",
]);
const milestoneStatusEnum = z.enum([
  "pending",
  "in_progress",
  "completed",
  "overdue",
]);
const issueStatusEnum = z.enum(["open", "in_progress", "resolved", "closed"]);
const issueSeverityEnum = z.enum(["low", "medium", "high", "critical"]);
const updateKindEnum = z.enum(["daily", "weekly", "milestone", "general"]);
const projectRoleEnum = z.enum([
  "project_owner",
  "project_manager",
  "qs_manager",
  "finance_reviewer",
  "site_supervisor",
  "viewer",
]);

const workerPayBasisEnum = z.enum([
  "daily",
  "weekly",
  "monthly",
  "fixed_contract",
  "milestone_based",
]);
const workerStatusEnum = z.enum(["active", "inactive", "terminated"]);
const payrollRunStatusEnum = z.enum(["draft", "finalized", "paid"]);
const payrollEntryPaymentStatusEnum = z.enum(["pending", "paid", "on_hold"]);
const budgetLineCategoryEnum = z.enum([
  "preliminaries",
  "substructure",
  "superstructure",
  "mep",
  "finishing",
  "external_works",
  "contingency",
  "professional_fees",
  "other",
]);
const customerAccessLevelEnum = z.enum(["overview", "detailed"]);

// ---------------------------------------------------------------------------
// Router
// ---------------------------------------------------------------------------

export const projectsRouter = createTRPCRouter({
  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------

  /** List all projects for the company. */
  list: membershipProcedure
    .input(
      z.object({
        status: projectStatusEnum.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return [];

      return listProjectsForCompany(db, ctx.auth.activeMembership.companyId, {
        status: input.status,
      });
    }),

  /** Get a single project with full details. */
  get: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return null;

      return getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
    }),

  /** Project count by status. */
  stats: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db) {
      return {
        draft: 0,
        active: 0,
        paused: 0,
        delayed: 0,
        completed: 0,
        archived: 0,
      };
    }

    return countProjectsByStatus(db, ctx.auth.activeMembership.companyId);
  }),

  // -------------------------------------------------------------------------
  // Project CRUD mutations
  // -------------------------------------------------------------------------

  /** Create a new project. */
  create: membershipProcedure
    .input(
      z.object({
        name: z.string().trim().min(1, "Project name is required."),
        code: z.string().trim().optional().nullable(),
        type: projectTypeEnum.optional().nullable(),
        location: z.string().trim().optional().nullable(),
        description: z.string().trim().optional().nullable(),
        startDate: z.string().optional().nullable(),
        targetCompletionDate: z.string().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return createProject(db, {
        companyId: ctx.auth.activeMembership.companyId,
        name: input.name,
        code: input.code ?? null,
        type: input.type ?? null,
        location: input.location ?? null,
        description: input.description ?? null,
        startDate: input.startDate ? new Date(input.startDate) : null,
        targetCompletionDate: input.targetCompletionDate
          ? new Date(input.targetCompletionDate)
          : null,
      });
    }),

  /** Update a project's name or status. */
  update: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        name: z.string().trim().min(1).optional(),
        status: projectStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return updateProject(db, input.projectId, ctx.auth.activeMembership.companyId, {
        ...(input.name ? { name: input.name } : {}),
        ...(input.status ? { status: input.status } : {}),
        ...(input.status === "completed" ? { completedAt: new Date() } : {}),
      });
    }),

  /** Soft-delete a project. */
  delete: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      await deleteProject(db, input.projectId, ctx.auth.activeMembership.companyId);
      return { deleted: true };
    }),

  // -------------------------------------------------------------------------
  // Phases
  // -------------------------------------------------------------------------

  /** Add a phase to a project. */
  createPhase: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        name: z.string().trim().min(1, "Phase name is required."),
        order: z.number().int().min(0).optional().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      // Verify project belongs to company
      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectPhase(db, {
        projectId: input.projectId,
        name: input.name,
        order: input.order,
      });
    }),

  /** Update a phase's status. */
  updatePhase: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        phaseId: z.string().uuid(),
        status: phaseStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return updateProjectPhase(db, input.phaseId, {
        ...(input.status ? { status: input.status } : {}),
      });
    }),

  // -------------------------------------------------------------------------
  // Milestones
  // -------------------------------------------------------------------------

  /** Add a milestone to a project. */
  createMilestone: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        phaseId: z.string().uuid().optional().nullable(),
        name: z.string().trim().min(1, "Milestone name is required."),
        dueDate: z.string().optional().nullable(),
        notes: z.string().trim().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectMilestone(db, {
        projectId: input.projectId,
        phaseId: input.phaseId ?? null,
        name: input.name,
        dueDate: input.dueDate ? new Date(input.dueDate) : null,
        notes: input.notes ?? null,
      });
    }),

  /** Update a milestone's status. */
  updateMilestone: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        milestoneId: z.string().uuid(),
        status: milestoneStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return updateProjectMilestone(db, input.milestoneId, {
        ...(input.status ? { status: input.status } : {}),
        ...(input.status === "completed" ? { completedAt: new Date() } : {}),
      });
    }),

  // -------------------------------------------------------------------------
  // Updates
  // -------------------------------------------------------------------------

  /** Post a progress update. */
  createUpdate: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        kind: updateKindEnum.optional().default("general"),
        summary: z.string().trim().min(1, "Summary is required."),
        details: z.string().trim().optional().nullable(),
        progressPercent: z
          .number()
          .int()
          .min(0)
          .max(100)
          .optional()
          .nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectUpdate(db, {
        projectId: input.projectId,
        authorId: ctx.auth.session.user.id,
        kind: input.kind,
        summary: input.summary,
        details: input.details ?? null,
        progressPercent: input.progressPercent ?? null,
      });
    }),

  // -------------------------------------------------------------------------
  // Issues
  // -------------------------------------------------------------------------

  /** Report a new issue. */
  createIssue: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        title: z.string().trim().min(1, "Issue title is required."),
        description: z.string().trim().optional().nullable(),
        severity: issueSeverityEnum.optional().default("medium"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectIssue(db, {
        projectId: input.projectId,
        title: input.title,
        description: input.description ?? null,
        severity: input.severity,
      });
    }),

  /** Update an issue's status. */
  updateIssue: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        issueId: z.string().uuid(),
        status: issueStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return updateProjectIssue(db, input.issueId, {
        ...(input.status ? { status: input.status } : {}),
        ...(input.status === "resolved" || input.status === "closed"
          ? { closedAt: new Date() }
          : {}),
      });
    }),

  // -------------------------------------------------------------------------
  // Team assignments
  // -------------------------------------------------------------------------

  /** Assign a member to a project. */
  assignMember: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        membershipId: z.string().uuid(),
        projectRole: projectRoleEnum.optional().default("viewer"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return assignMemberToProject(db, {
        projectId: input.projectId,
        membershipId: input.membershipId,
        projectRole: input.projectRole,
      });
    }),

  /** Remove a member from a project. */
  removeMember: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        assignmentId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      await removeAssignmentFromProject(db, input.assignmentId);
      return { removed: true };
    }),

  // -------------------------------------------------------------------------
  // Budget
  // -------------------------------------------------------------------------

  /** Get or initialize the project budget. */
  getBudget: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return null;

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project) return null;

      return getProjectBudget(db, input.projectId);
    }),

  /** Create or update the project budget summary. */
  upsertBudget: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        currency: z.string().trim().optional(),
        approvedBudgetMinor: z.number().int().min(0).optional(),
        forecastBudgetMinor: z.number().int().min(0).optional(),
        actualBudgetMinor: z.number().int().min(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return upsertProjectBudget(db, input);
    }),

  /** Add a budget line item. */
  createBudgetLine: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        budgetId: z.string().uuid(),
        category: budgetLineCategoryEnum.optional().default("other"),
        description: z.string().trim().min(1, "Description is required."),
        quantity: z.number().min(0).optional().nullable(),
        unitRateMinor: z.number().int().min(0).optional().nullable(),
        estimatedMinor: z.number().int().min(0).optional().default(0),
        actualMinor: z.number().int().min(0).optional().default(0),
        notes: z.string().trim().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createBudgetLineItem(db, {
        budgetId: input.budgetId,
        category: input.category,
        description: input.description,
        quantity: input.quantity ?? null,
        unitRateMinor: input.unitRateMinor ?? null,
        estimatedMinor: input.estimatedMinor,
        actualMinor: input.actualMinor,
        notes: input.notes ?? null,
      });
    }),

  /** Update a budget line item. */
  updateBudgetLine: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        lineItemId: z.string().uuid(),
        category: budgetLineCategoryEnum.optional(),
        description: z.string().trim().min(1).optional(),
        quantity: z.number().min(0).optional().nullable(),
        unitRateMinor: z.number().int().min(0).optional().nullable(),
        estimatedMinor: z.number().int().min(0).optional(),
        actualMinor: z.number().int().min(0).optional(),
        notes: z.string().trim().optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      const { projectId: _, lineItemId, ...data } = input;
      return updateBudgetLineItem(db, lineItemId, data);
    }),

  /** Delete a budget line item. */
  deleteBudgetLine: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        lineItemId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      await deleteBudgetLineItem(db, input.lineItemId);
      return { deleted: true };
    }),

  // -------------------------------------------------------------------------
  // Workers
  // -------------------------------------------------------------------------

  /** List workers on a project. */
  listWorkers: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        status: workerStatusEnum.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return [];

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project) return [];

      return listProjectWorkers(db, input.projectId, {
        status: input.status,
      });
    }),

  /** Add a worker to a project. */
  createWorker: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        employeeId: z.string().uuid().optional().nullable(),
        fullName: z.string().trim().min(1, "Worker name is required."),
        role: z.string().trim().optional().nullable(),
        payBasis: workerPayBasisEnum.optional().default("daily"),
        payRateMinor: z.number().int().min(0).optional().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectWorker(db, {
        projectId: input.projectId,
        employeeId: input.employeeId ?? null,
        fullName: input.fullName,
        role: input.role ?? null,
        payBasis: input.payBasis,
        payRateMinor: input.payRateMinor,
      });
    }),

  /** Update a worker's details. */
  updateWorker: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        workerId: z.string().uuid(),
        fullName: z.string().trim().min(1).optional(),
        role: z.string().trim().optional().nullable(),
        payBasis: workerPayBasisEnum.optional(),
        payRateMinor: z.number().int().min(0).optional(),
        status: workerStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      const { projectId: _, workerId, ...data } = input;
      return updateProjectWorker(db, workerId, data);
    }),

  /** Remove a worker from a project. */
  deleteWorker: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        workerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      await deleteProjectWorker(db, input.workerId);
      return { deleted: true };
    }),

  // -------------------------------------------------------------------------
  // Payroll Runs
  // -------------------------------------------------------------------------

  /** List payroll runs for a project. */
  listPayrollRuns: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return [];

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project) return [];

      return listProjectPayrollRuns(db, input.projectId);
    }),

  /** Get a single payroll run with entries. */
  getPayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        payrollRunId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return null;

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project) return null;

      return getProjectPayrollRun(db, input.payrollRunId);
    }),

  /** Create a new payroll run. */
  createPayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        periodStart: z.string().min(1, "Period start is required."),
        periodEnd: z.string().min(1, "Period end is required."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectPayrollRun(db, {
        projectId: input.projectId,
        periodStart: new Date(input.periodStart),
        periodEnd: new Date(input.periodEnd),
      });
    }),

  /** Update a payroll run's status or totals. */
  updatePayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        payrollRunId: z.string().uuid(),
        status: payrollRunStatusEnum.optional(),
        totalGrossMinor: z.number().int().min(0).optional(),
        totalNetMinor: z.number().int().min(0).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      const { projectId: _, payrollRunId, ...data } = input;
      return updateProjectPayrollRun(db, payrollRunId, data);
    }),

  // -------------------------------------------------------------------------
  // Payroll Entries
  // -------------------------------------------------------------------------

  /** Add a payroll entry to a run. */
  createPayrollEntry: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        payrollRunId: z.string().uuid(),
        workerId: z.string().uuid(),
        attendanceUnits: z.number().min(0).optional().nullable(),
        grossMinor: z.number().int().min(0).optional().default(0),
        deductionMinor: z.number().int().min(0).optional().default(0),
        advanceMinor: z.number().int().min(0).optional().default(0),
        netMinor: z.number().int().min(0).optional().default(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectPayrollEntry(db, {
        payrollRunId: input.payrollRunId,
        workerId: input.workerId,
        attendanceUnits: input.attendanceUnits ?? null,
        grossMinor: input.grossMinor,
        deductionMinor: input.deductionMinor,
        advanceMinor: input.advanceMinor,
        netMinor: input.netMinor,
      });
    }),

  /** Update a payroll entry. */
  updatePayrollEntry: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        entryId: z.string().uuid(),
        attendanceUnits: z.number().min(0).optional().nullable(),
        grossMinor: z.number().int().min(0).optional(),
        deductionMinor: z.number().int().min(0).optional(),
        advanceMinor: z.number().int().min(0).optional(),
        netMinor: z.number().int().min(0).optional(),
        paymentStatus: payrollEntryPaymentStatusEnum.optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      const { projectId: _, entryId, ...data } = input;
      return updateProjectPayrollEntry(db, entryId, data);
    }),

  // -------------------------------------------------------------------------
  // Customer Access
  // -------------------------------------------------------------------------

  /** List customers with access to a project. */
  listCustomerAccess: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return [];

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project) return [];

      return listCustomerAccessForProject(db, input.projectId);
    }),

  /** Grant a customer access to view a project. */
  grantCustomerAccess: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        customerId: z.string().uuid(),
        level: customerAccessLevelEnum.optional().default("overview"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return grantCustomerProjectAccess(db, {
        projectId: input.projectId,
        customerId: input.customerId,
        level: input.level,
      });
    }),

  /** Revoke a customer's access to a project. */
  revokeCustomerAccess: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        customerId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return revokeCustomerProjectAccess(db, input.projectId, input.customerId);
    }),

  /** Send a notice to a customer about a project. */
  createCustomerNotice: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        customerId: z.string().uuid(),
        title: z.string().trim().min(1, "Title is required."),
        body: z.string().trim().min(1, "Body is required."),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return createProjectCustomerNotice(db, {
        projectId: input.projectId,
        customerId: input.customerId,
        title: input.title,
        body: input.body,
      });
    }),

  /** Delete a customer notice. */
  deleteCustomerNotice: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        noticeId: z.string().uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      await deleteProjectCustomerNotice(db, input.noticeId);
      return { deleted: true };
    }),

  // -------------------------------------------------------------------------
  // Visibility Toggles
  // -------------------------------------------------------------------------

  /** Toggle whether a milestone is visible to customers. */
  toggleMilestoneVisibility: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        milestoneId: z.string().uuid(),
        visible: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return toggleMilestoneCustomerVisibility(
        db,
        input.milestoneId,
        input.visible,
      );
    }),

  /** Toggle whether an update is visible to customers. */
  toggleUpdateVisibility: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        updateId: z.string().uuid(),
        visible: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const project = await getProjectById(
        db,
        input.projectId,
        ctx.auth.activeMembership.companyId,
      );
      if (!project)
        throw new TRPCError({ code: "NOT_FOUND", message: "Project not found." });

      return toggleUpdateCustomerVisibility(db, input.updateId, input.visible);
    }),
});
