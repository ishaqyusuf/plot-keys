import {
  assignMemberToProject,
  countProjectsByStatus,
  createProject,
  createProjectBudgetLineItem,
  createProjectIssue,
  createProjectMilestone,
  createProjectPayrollRun,
  createProjectPhase,
  createProjectUpdate,
  createProjectWorker,
  deleteProject,
  deleteProjectBudgetLineItem,
  deleteProjectPayrollEntry,
  deleteProjectPayrollRun,
  deleteProjectWorker,
  getOrCreateProjectBudget,
  getProjectBudgetWithLineItems,
  getProjectById,
  getProjectPayrollRunWithEntries,
  listProjectPayrollRuns,
  listProjectWorkers,
  listProjectsForCompany,
  removeAssignmentFromProject,
  updateProject,
  updateProjectBudget,
  updateProjectBudgetLineItem,
  updateProjectIssue,
  updateProjectMilestone,
  updateProjectPayrollRun,
  updateProjectPhase,
  updateProjectWorker,
  upsertProjectPayrollEntry,
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
  "fixed_contract",
  "milestone_based",
]);
const workerStatusEnum = z.enum(["active", "off_project", "completed"]);
const payrollRunStatusEnum = z.enum(["draft", "confirmed", "paid"]);
const workerPaymentStatusEnum = z.enum(["pending", "paid", "partial"]);

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

  /** Get or create the budget summary for a project. */
  getBudget: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
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

      return getProjectBudgetWithLineItems(db, input.projectId);
    }),

  /** Update the budget summary totals. */
  updateBudget: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        approvedBudgetMinor: z.number().int().min(0).optional(),
        forecastBudgetMinor: z.number().int().min(0).optional(),
        actualBudgetMinor: z.number().int().min(0).optional(),
        currency: z.string().optional(),
        notes: z.string().nullable().optional(),
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

      const budget = await getOrCreateProjectBudget(db, input.projectId);
      return updateProjectBudget(db, budget.id, {
        approvedBudgetMinor: input.approvedBudgetMinor,
        forecastBudgetMinor: input.forecastBudgetMinor,
        actualBudgetMinor: input.actualBudgetMinor,
        currency: input.currency,
        notes: input.notes,
      });
    }),

  /** Add a budget line item. */
  addBudgetLineItem: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        category: z.string().min(1),
        description: z.string().min(1),
        quantity: z.number().nullable().optional(),
        unitRateMinor: z.number().int().nullable().optional(),
        estimatedMinor: z.number().int().min(0).default(0),
        actualMinor: z.number().int().min(0).default(0),
        notes: z.string().nullable().optional(),
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

      const budget = await getOrCreateProjectBudget(db, input.projectId);
      return createProjectBudgetLineItem(db, {
        projectId: input.projectId,
        budgetId: budget.id,
        category: input.category,
        description: input.description,
        quantity: input.quantity,
        unitRateMinor: input.unitRateMinor,
        estimatedMinor: input.estimatedMinor,
        actualMinor: input.actualMinor,
        notes: input.notes,
      });
    }),

  /** Update a budget line item. */
  updateBudgetLineItem: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        lineItemId: z.string().uuid(),
        category: z.string().optional(),
        description: z.string().optional(),
        quantity: z.number().nullable().optional(),
        unitRateMinor: z.number().int().nullable().optional(),
        estimatedMinor: z.number().int().min(0).optional(),
        actualMinor: z.number().int().min(0).optional(),
        notes: z.string().nullable().optional(),
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

      return updateProjectBudgetLineItem(db, input.lineItemId, {
        category: input.category,
        description: input.description,
        quantity: input.quantity,
        unitRateMinor: input.unitRateMinor,
        estimatedMinor: input.estimatedMinor,
        actualMinor: input.actualMinor,
        notes: input.notes,
      });
    }),

  /** Delete a budget line item. */
  deleteBudgetLineItem: membershipProcedure
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

      await deleteProjectBudgetLineItem(db, input.lineItemId);
      return { deleted: true };
    }),

  // -------------------------------------------------------------------------
  // Workers
  // -------------------------------------------------------------------------

  /** List all workers on a project. */
  listWorkers: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        status: workerStatusEnum.optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      return listProjectWorkers(db, input.projectId, {
        status: input.status,
      });
    }),

  /** Add a worker to a project. */
  addWorker: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        fullName: z.string().min(1),
        role: z.string().min(1),
        payBasis: workerPayBasisEnum.optional().default("daily"),
        payRateMinor: z.number().int().min(0).default(0),
        currency: z.string().default("NGN"),
        contractorName: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
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
        fullName: input.fullName,
        role: input.role,
        payBasis: input.payBasis,
        payRateMinor: input.payRateMinor,
        currency: input.currency,
        contractorName: input.contractorName,
        notes: input.notes,
      });
    }),

  /** Update a project worker. */
  updateWorker: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        workerId: z.string().uuid(),
        fullName: z.string().optional(),
        role: z.string().optional(),
        payBasis: workerPayBasisEnum.optional(),
        payRateMinor: z.number().int().min(0).optional(),
        status: workerStatusEnum.optional(),
        notes: z.string().nullable().optional(),
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

      return updateProjectWorker(db, input.workerId, {
        fullName: input.fullName,
        role: input.role,
        payBasis: input.payBasis,
        payRateMinor: input.payRateMinor,
        status: input.status,
        notes: input.notes,
      });
    }),

  /** Remove a worker from a project. */
  removeWorker: membershipProcedure
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
      return { removed: true };
    }),

  // -------------------------------------------------------------------------
  // Payroll Runs
  // -------------------------------------------------------------------------

  /** List all payroll runs for a project. */
  listPayrollRuns: membershipProcedure
    .input(z.object({ projectId: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
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

      return listProjectPayrollRuns(db, input.projectId);
    }),

  /** Get a payroll run with its entries. */
  getPayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        runId: z.string().uuid(),
      }),
    )
    .query(async ({ ctx, input }) => {
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

      return getProjectPayrollRunWithEntries(db, input.runId);
    }),

  /** Create a new payroll run for a project. */
  createPayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        periodStart: z.string(),
        periodEnd: z.string(),
        currency: z.string().default("NGN"),
        notes: z.string().nullable().optional(),
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
        currency: input.currency,
        notes: input.notes,
      });
    }),

  /** Update a payroll run status or totals. */
  updatePayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        runId: z.string().uuid(),
        status: payrollRunStatusEnum.optional(),
        totalGrossMinor: z.number().int().min(0).optional(),
        totalNetMinor: z.number().int().min(0).optional(),
        notes: z.string().nullable().optional(),
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

      return updateProjectPayrollRun(db, input.runId, {
        status: input.status,
        totalGrossMinor: input.totalGrossMinor,
        totalNetMinor: input.totalNetMinor,
        notes: input.notes,
      });
    }),

  /** Delete a payroll run. */
  deletePayrollRun: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        runId: z.string().uuid(),
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

      await deleteProjectPayrollRun(db, input.runId);
      return { deleted: true };
    }),

  /** Upsert a payroll entry (worker within a run). */
  upsertPayrollEntry: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        runId: z.string().uuid(),
        workerId: z.string().uuid(),
        attendanceUnits: z.number().min(0).default(0),
        grossMinor: z.number().int().min(0).default(0),
        deductionMinor: z.number().int().min(0).default(0),
        advanceMinor: z.number().int().min(0).default(0),
        netMinor: z.number().int().min(0).default(0),
        paymentStatus: workerPaymentStatusEnum.optional().default("pending"),
        notes: z.string().nullable().optional(),
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

      return upsertProjectPayrollEntry(db, {
        payrollRunId: input.runId,
        workerId: input.workerId,
        attendanceUnits: input.attendanceUnits,
        grossMinor: input.grossMinor,
        deductionMinor: input.deductionMinor,
        advanceMinor: input.advanceMinor,
        netMinor: input.netMinor,
        paymentStatus: input.paymentStatus,
        notes: input.notes,
      });
    }),

  /** Delete a payroll entry. */
  deletePayrollEntry: membershipProcedure
    .input(
      z.object({
        projectId: z.string().uuid(),
        entryId: z.string().uuid(),
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

      await deleteProjectPayrollEntry(db, input.entryId);
      return { deleted: true };
    }),
});
