import type { MembershipRole } from "@plotkeys/db";
import {
  acceptTeamInvite,
  completeTeamInviteProfile,
  countActiveMemberships,
  createTeamInvite,
  findCompanyById,
  findMembershipById,
  findMembershipForUser,
  findTeamInviteByToken,
  findUserByEmail,
  getTeamInviteProfileCompletionData,
  listMembershipRemovalTargets,
  listMembershipsForCompany,
  listPendingTeamInvites,
  reactivateMember,
  removeMember,
  revokeTeamInvite,
  suspendMember,
  updateCompanyLogo,
  updateCompanyProfile,
  updateMemberRole,
} from "@plotkeys/db/queries";
import {
  type NotificationTaskPayload,
  notificationHandler,
  triggerJob,
} from "@plotkeys/jobs";
import { notification } from "@plotkeys/jobs/tasks";
import { NotificationService } from "@plotkeys/notifications";
import {
  buildDashboardUrl,
  WORK_ROLE_LABELS,
  WORK_ROLE_VALUES,
} from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  assertMinRole,
  authenticatedProcedure,
  createTRPCRouter,
  membershipProcedure,
  minRoleProcedure,
  publicProcedure,
} from "../lib.trpc";
import {
  completeTeamInviteProfileInputSchema,
  teamInviteTokenInputSchema,
  updateTeamInputSchema,
} from "../schemas/team.schema";

// Member cap per plan tier
const planMemberCap: Record<string, number> = {
  starter: 1,
  plus: 10,
  pro: Infinity,
};

function getInviteRoleLabel(role: "admin" | "agent" | "staff") {
  if (role === "agent") {
    return "an agent";
  }

  if (role === "staff") {
    return "an employee";
  }

  return "a team admin";
}

async function sendWorkspaceInvitationNotification(input: {
  companyId: string;
  companyName: string;
  inviteUrl: string;
  inviterId: string;
  inviterName: string;
  recipientEmail: string;
  roleLabel: string;
}) {
  const tasksClient = {
    trigger: async (_taskId: string, payload: NotificationTaskPayload) => {
      await triggerJob(notification, notificationHandler, payload);
    },
  };

  const notifications = new NotificationService(tasksClient, {
    companyId: input.companyId,
    userId: input.inviterId,
  }).setRecipients([
    {
      displayName: input.recipientEmail,
      email: input.recipientEmail,
      kind: "subscriber",
      subscriberId: `workspace-invite:${input.recipientEmail.toLowerCase()}`,
      topic: "workspace-invitation",
    },
  ]);

  await notifications.send("workspace_invitation_sent", {
    channels: ["email"],
    payload: {
      companyName: input.companyName,
      inviteUrl: input.inviteUrl,
      inviterName: input.inviterName,
      recipientEmail: input.recipientEmail,
      roleLabel: input.roleLabel,
    },
    sendEmail: true,
  });
}

export const teamRouter = createTRPCRouter({
  current: membershipProcedure.query(async ({ ctx }) => {
    const company = await findCompanyById(
      ctx.db.db,
      ctx.auth.activeMembership.companyId,
    );

    if (!company) {
      return null;
    }

    return {
      id: company.id,
      logoUrl: company.logoUrl,
      market: company.market,
      name: company.name,
      planStatus: company.planStatus,
      planTier: company.planTier,
      slug: company.slug,
    };
  }),

  update: membershipProcedure
    .input(updateTeamInputSchema)
    .mutation(async ({ ctx, input }) => {
      assertMinRole(ctx.auth.activeMembership.role, "admin");

      const db = ctx.db.db;
      const companyId = ctx.auth.activeMembership.companyId;
      if (input.name !== undefined || input.market !== undefined) {
        await updateCompanyProfile(db, companyId, {
          market: input.market,
          name: input.name,
        });
      }
      if (input.logoUrl !== undefined) {
        await updateCompanyLogo(db, companyId, input.logoUrl);
      }

      const company = await findCompanyById(db, companyId);
      if (!company) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Workspace not found.",
        });
      }

      return {
        id: company.id,
        logoUrl: company.logoUrl,
        market: company.market,
        name: company.name,
        planStatus: company.planStatus,
        planTier: company.planTier,
        slug: company.slug,
      };
    }),

  /** Team plan metadata used by the dashboard team page. */
  getOverview: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "DB unavailable.",
      });

    const company = await findCompanyById(
      db,
      ctx.auth.activeMembership.companyId,
    );
    const planTier = company?.planTier ?? "starter";
    const cap = planMemberCap[planTier] ?? planMemberCap.starter;
    const activeCount = await countActiveMemberships(
      db,
      ctx.auth.activeMembership.companyId,
    );

    return {
      activeCount,
      cap: cap === Infinity ? null : cap,
      planTier,
    };
  }),

  /** List all memberships (active, invited, suspended) for the caller's company. */
  listMembers: membershipProcedure
    .input(
      z
        .object({
          cursor: z.union([z.string(), z.number()]).optional().nullable(),
          end: z.string().optional().nullable(),
          q: z.string().optional().nullable(),
          size: z.union([z.string(), z.number()]).optional().nullable(),
          sort: z.array(z.string()).optional().nullable(),
          start: z.string().optional().nullable(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return listMembershipsForCompany(
        db,
        ctx.auth.activeMembership.companyId,
        {
          cursor: input?.cursor,
          end: input?.end,
          q: input?.q,
          size: input?.size,
          sort: input?.sort,
          start: input?.start,
        },
      );
    }),

  /** List pending (not accepted, not revoked, not expired) invites. */
  listInvites: minRoleProcedure("admin").query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "DB unavailable.",
      });

    return listPendingTeamInvites(db, ctx.auth.activeMembership.companyId);
  }),

  /** Invite a new team member by email. Requires admin role. */
  inviteMember: minRoleProcedure("admin")
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["admin", "agent", "staff"]),
        workRole: z.enum(WORK_ROLE_VALUES).optional().nullable(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const companyId = ctx.auth.activeMembership.companyId;

      // Plan enforcement: check member cap
      const company = await findCompanyById(db, companyId);
      if (!company) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Workspace not found.",
        });
      }

      const cap = planMemberCap[company.planTier] ?? 1;
      if (cap !== Infinity) {
        const activeCount = await countActiveMemberships(db, companyId);
        if (activeCount >= cap) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: `Your ${company.planTier} plan supports up to ${cap} team member${cap === 1 ? "" : "s"}. Upgrade to invite more.`,
          });
        }
      }

      // Prevent inviting someone already in the company
      const emailLower = input.email.trim().toLowerCase();
      const existingUser = await findUserByEmail(db, emailLower);
      if (existingUser) {
        const existingMembership = await findMembershipForUser(db, {
          companyId,
          userId: existingUser.id,
        });
        if (existingMembership) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "This person is already a member of your workspace.",
          });
        }
      }

      // Cannot invite someone to a role above your own
      assertMinRole(
        ctx.auth.activeMembership.role,
        input.role as MembershipRole,
      );

      const invite = await createTeamInvite(db, {
        companyId,
        email: emailLower,
        role: input.role as MembershipRole,
        workRole: input.workRole ?? null,
        invitedById: ctx.auth.session.user.id,
      });
      const inviteUrl = `/join/${invite.token}`;

      await sendWorkspaceInvitationNotification({
        companyId,
        companyName: company.name ?? "your company",
        inviteUrl: new URL(inviteUrl, buildDashboardUrl()).toString(),
        inviterId: ctx.auth.session.user.id,
        inviterName:
          ctx.auth.session.user.name ??
          ctx.auth.session.user.email ??
          "Workspace user",
        recipientEmail: emailLower,
        roleLabel: input.workRole
          ? (WORK_ROLE_LABELS[input.workRole] ?? input.workRole)
          : getInviteRoleLabel(input.role),
      });

      return {
        invite,
        inviteUrl,
      };
    }),

  /** Change a member's role. Requires admin. Cannot promote to a role above your own. */
  updateMemberRole: minRoleProcedure("admin")
    .input(
      z.object({
        membershipId: z.string().uuid(),
        role: z.enum(["admin", "agent", "staff"]),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      assertMinRole(
        ctx.auth.activeMembership.role,
        input.role as MembershipRole,
      );

      // Cannot change the owner's role
      const target = await findMembershipById(db, input.membershipId);
      if (target?.role === "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot change the owner's role.",
        });
      }

      return updateMemberRole(db, {
        membershipId: input.membershipId,
        companyId: ctx.auth.activeMembership.companyId,
        role: input.role as MembershipRole,
      });
    }),

  /** Suspend a member. Requires admin. */
  suspendMember: minRoleProcedure("admin")
    .input(z.object({ membershipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const target = await findMembershipById(db, input.membershipId);
      if (target?.role === "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot suspend the owner.",
        });
      }

      return suspendMember(db, {
        membershipId: input.membershipId,
        companyId: ctx.auth.activeMembership.companyId,
      });
    }),

  /** Reactivate a suspended member. Requires admin. */
  reactivateMember: minRoleProcedure("admin")
    .input(z.object({ membershipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return reactivateMember(db, {
        membershipId: input.membershipId,
        companyId: ctx.auth.activeMembership.companyId,
      });
    }),

  /** Remove a member from the workspace. Requires admin. */
  removeMember: minRoleProcedure("admin")
    .input(z.object({ membershipId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const target = await findMembershipById(db, input.membershipId);
      if (target?.role === "owner") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot remove the owner.",
        });
      }
      if (target?.userId === ctx.auth.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot remove yourself.",
        });
      }

      return removeMember(db, {
        membershipId: input.membershipId,
        companyId: ctx.auth.activeMembership.companyId,
      });
    }),

  /** Remove multiple members from the workspace. Requires admin. */
  removeMembers: minRoleProcedure("admin")
    .input(z.object({ membershipIds: z.array(z.string().uuid()).min(1) }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const targets = await listMembershipRemovalTargets(db, {
        companyId: ctx.auth.activeMembership.companyId,
        membershipIds: input.membershipIds,
      });

      if (targets.some((target) => target.role === "owner")) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot remove the owner.",
        });
      }

      if (
        targets.some((target) => target.userId === ctx.auth.session.user.id)
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot remove yourself.",
        });
      }

      await Promise.all(
        input.membershipIds.map((membershipId) =>
          removeMember(db, {
            membershipId,
            companyId: ctx.auth.activeMembership.companyId,
          }),
        ),
      );

      return { ids: input.membershipIds };
    }),

  /** Revoke a pending invite. Requires admin. */
  revokeInvite: minRoleProcedure("admin")
    .input(z.object({ inviteId: z.string().uuid() }))
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      return revokeTeamInvite(db, {
        inviteId: input.inviteId,
        companyId: ctx.auth.activeMembership.companyId,
      });
    }),

  /** Public: look up a team invite by token (for the join page). */
  getInviteByToken: publicProcedure
    .input(teamInviteTokenInputSchema)
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) return null;

      const invite = await findTeamInviteByToken(db, input.token);
      if (!invite) return null;

      // Return only safe public fields
      return {
        companyName: invite.company.name,
        companySlug: invite.company.slug,
        email: invite.email,
        role: invite.role,
        expiresAt: invite.expiresAt,
        isExpired: invite.expiresAt < new Date(),
        isAccepted: !!invite.acceptedAt,
        isRevoked: !!invite.revokedAt,
      };
    }),
  getInviteProfileCompletion: authenticatedProcedure
    .input(teamInviteTokenInputSchema)
    .query(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db) {
        throw new TRPCError({
          code: "SERVICE_UNAVAILABLE",
          message: "Database is unavailable.",
        });
      }
      const userEmail = ctx.auth.session.user.email;
      if (!userEmail) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "A verified email address is required.",
        });
      }

      const result = await getTeamInviteProfileCompletionData(db, {
        token: input.token,
        userEmail,
      });

      if (!result.ok) {
        return result;
      }

      return {
        agentProfile: result.agentProfile
          ? {
              bio: result.agentProfile.bio,
              imageUrl: result.agentProfile.imageUrl,
              name: result.agentProfile.name,
              phone: result.agentProfile.phone,
            }
          : null,
        employeeProfile: result.employeeProfile
          ? {
              name: result.employeeProfile.name,
              phone: result.employeeProfile.phone,
            }
          : null,
        invite: {
          companyName: result.invite.company.name,
          email: result.invite.email,
          role: result.invite.role,
          workRole: result.invite.workRole,
        },
        ok: true as const,
      };
    }),

  /** Accept an invite with an authenticated session; membership is not required. */
  acceptInvite: authenticatedProcedure
    .input(teamInviteTokenInputSchema)
    .mutation(async ({ ctx, input }) => {
      const db = ctx.db.db;
      if (!db)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DB unavailable.",
        });

      const invite = await findTeamInviteByToken(db, input.token);
      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found.",
        });
      }

      const sessionEmail = ctx.auth.session.user.email?.trim().toLowerCase();
      if (!sessionEmail) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your account must have an email address to accept invites.",
        });
      }

      if (invite.email.trim().toLowerCase() !== sessionEmail) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invite belongs to a different email address.",
        });
      }

      return acceptTeamInvite(db, {
        token: input.token,
        userId: ctx.auth.session.user.id,
      });
    }),
  completeInviteProfile: authenticatedProcedure
    .input(completeTeamInviteProfileInputSchema)
    .mutation(async ({ ctx, input }) => {
      const sessionEmail = ctx.auth.session.user.email?.trim();
      if (!sessionEmail) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Your account must have an email address.",
        });
      }

      const db = ctx.db.db;
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not configured.",
        });
      }

      const invite = await findTeamInviteByToken(db, input.token);
      if (!invite) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Invite not found.",
        });
      }

      if (invite.email.toLowerCase() !== sessionEmail.toLowerCase()) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "This invite belongs to a different email address.",
        });
      }

      if (!invite.acceptedAt) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Accept the invite before completing your profile.",
        });
      }

      if (invite.role !== "agent" && invite.role !== "staff") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This invite does not require profile completion.",
        });
      }

      const isAgentInvite = invite.role === "agent";
      const title = isAgentInvite
        ? "Agent"
        : invite.workRole
          ? (WORK_ROLE_LABELS[invite.workRole] ?? invite.workRole)
          : "Staff";
      const result = await completeTeamInviteProfile(db, {
        bio: isAgentInvite ? input.bio?.trim() || null : null,
        imageUrl: isAgentInvite ? input.imageUrl?.trim() || null : null,
        name: input.name,
        phone: input.phone?.trim() || null,
        title,
        token: input.token,
        userEmail: sessionEmail,
      });

      if (!result.ok) {
        const message =
          result.reason === "email-mismatch"
            ? "This invite belongs to a different email address."
            : result.reason === "invite-not-accepted"
              ? "Accept the invite before completing your profile."
              : result.reason === "unsupported-role"
                ? "This invite does not require profile completion."
                : "Invite not found.";

        throw new TRPCError({
          code: "BAD_REQUEST",
          message,
        });
      }

      return result;
    }),
});
