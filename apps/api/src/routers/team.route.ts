import type { MembershipRole } from "@plotkeys/db";
import {
  acceptTeamInvite,
  countActiveMemberships,
  createTeamInvite,
  findTeamInviteByToken,
  findUserByEmail,
  listMembershipsForCompany,
  listPendingTeamInvites,
  reactivateMember,
  removeMember,
  revokeTeamInvite,
  suspendMember,
  updateMemberRole,
} from "@plotkeys/db";
import { WORK_ROLE_VALUES } from "@plotkeys/utils";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  assertMinRole,
  createTRPCRouter,
  membershipProcedure,
  minRoleProcedure,
  publicProcedure,
} from "../lib.trpc";

// Member cap per plan tier
const planMemberCap: Record<string, number> = {
  starter: 1,
  plus: 10,
  pro: Infinity,
};

export const teamRouter = createTRPCRouter({
  /** List all memberships (active, invited, suspended) for the caller's company. */
  listMembers: membershipProcedure.query(async ({ ctx }) => {
    const db = ctx.db.db;
    if (!db)
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "DB unavailable.",
      });

    return listMembershipsForCompany(db, ctx.auth.activeMembership.companyId);
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
      const company = await db.company.findUniqueOrThrow({
        where: { id: companyId },
      });
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
        const existingMembership = await db.membership.findFirst({
          where: {
            companyId,
            userId: existingUser.id,
            deletedAt: null,
          },
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

      return {
        invite,
        inviteUrl: `/join/${invite.token}`,
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
      const target = await db.membership.findUnique({
        where: { id: input.membershipId },
      });
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

      const target = await db.membership.findUnique({
        where: { id: input.membershipId },
      });
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

      const target = await db.membership.findUnique({
        where: { id: input.membershipId },
      });
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
    .input(z.object({ token: z.string() }))
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

  /** Accept an invite (requires authenticated session, no membership needed). */
  acceptInvite: publicProcedure
    .input(z.object({ token: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.auth.session) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be signed in to accept an invite.",
        });
      }

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
});
