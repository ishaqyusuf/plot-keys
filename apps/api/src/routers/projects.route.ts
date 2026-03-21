import {
  assignMemberToProject,
  countProjectsByStatus,
  createProject,
  createProjectIssue,
  createProjectMilestone,
  createProjectPhase,
  createProjectUpdate,
  deleteProject,
  getProjectById,
  listProjectsForCompany,
  removeAssignmentFromProject,
  updateProject,
  updateProjectIssue,
  updateProjectMilestone,
  updateProjectPhase,
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
});
