import type { MembershipRole } from "../generated/prisma";
import type { Db } from "../prisma";

const INVITE_TTL_HOURS = 72;

function resolveDefaultWorkRoleForMembershipRole(role: MembershipRole) {
  if (role === "agent") {
    return "sales_agent";
  }

  if (role === "owner" || role === "platform_admin") {
    return "executive";
  }

  return "operations";
}

function generateInviteToken(): string {
  return (
    crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "")
  );
}

export async function listMembershipsForCompany(db: Db, companyId: string) {
  return db.membership.findMany({
    where: {
      companyId,
      deletedAt: null,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });
}

export async function createTeamInvite(
  db: Db,
  input: {
    companyId: string;
    email: string;
    role: MembershipRole;
    workRole?: string | null;
    invitedById: string;
  },
) {
  const token = generateInviteToken();
  const expiresAt = new Date(Date.now() + INVITE_TTL_HOURS * 60 * 60 * 1000);

  // Revoke any existing pending invites for this email + company combo
  await db.teamInvite.updateMany({
    where: {
      companyId: input.companyId,
      email: input.email.trim().toLowerCase(),
      acceptedAt: null,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });

  return db.teamInvite.create({
    data: {
      companyId: input.companyId,
      email: input.email.trim().toLowerCase(),
      role: input.role,
      workRole:
        input.workRole ?? resolveDefaultWorkRoleForMembershipRole(input.role),
      token,
      expiresAt,
      invitedById: input.invitedById,
    },
  });
}

export async function findTeamInviteByToken(db: Db, token: string) {
  return db.teamInvite.findUnique({
    where: { token },
    include: {
      company: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
}

export async function acceptTeamInvite(
  db: Db,
  input: {
    token: string;
    userId: string;
  },
) {
  const invite = await db.teamInvite.findUnique({
    where: { token: input.token },
  });

  if (!invite) {
    throw new Error("Invite not found.");
  }

  if (invite.acceptedAt) {
    throw new Error("Invite already accepted.");
  }

  if (invite.revokedAt) {
    throw new Error("Invite has been revoked.");
  }

  if (invite.expiresAt < new Date()) {
    throw new Error("Invite has expired.");
  }

  // Check if user is already a member
  const existingMembership = await db.membership.findFirst({
    where: {
      companyId: invite.companyId,
      userId: input.userId,
      deletedAt: null,
    },
  });

  if (existingMembership) {
    // Mark invite accepted and return existing membership
    await db.teamInvite.update({
      where: { token: input.token },
      data: { acceptedAt: new Date() },
    });
    return existingMembership;
  }

  // Create membership + mark invite accepted in a transaction
  const [membership] = await db.$transaction([
    db.membership.create({
      data: {
        companyId: invite.companyId,
        userId: input.userId,
        role: invite.role,
        workRole: invite.workRole,
        status: "active",
      },
    }),
    db.teamInvite.update({
      where: { token: input.token },
      data: { acceptedAt: new Date() },
    }),
  ]);

  return membership;
}

export async function updateMemberRole(
  db: Db,
  input: {
    membershipId: string;
    companyId: string;
    role: MembershipRole;
  },
) {
  return db.membership.update({
    where: {
      id: input.membershipId,
      companyId: input.companyId,
    },
    data: { role: input.role },
  });
}

export async function suspendMember(
  db: Db,
  input: { membershipId: string; companyId: string },
) {
  return db.membership.update({
    where: {
      id: input.membershipId,
      companyId: input.companyId,
    },
    data: { status: "suspended" },
  });
}

export async function reactivateMember(
  db: Db,
  input: { membershipId: string; companyId: string },
) {
  return db.membership.update({
    where: {
      id: input.membershipId,
      companyId: input.companyId,
    },
    data: { status: "active" },
  });
}

export async function removeMember(
  db: Db,
  input: { membershipId: string; companyId: string },
) {
  return db.membership.update({
    where: {
      id: input.membershipId,
      companyId: input.companyId,
    },
    data: { deletedAt: new Date() },
  });
}

export async function listPendingTeamInvites(db: Db, companyId: string) {
  return db.teamInvite.findMany({
    where: {
      companyId,
      acceptedAt: null,
      revokedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function revokeTeamInvite(
  db: Db,
  input: { inviteId: string; companyId: string },
) {
  return db.teamInvite.update({
    where: {
      id: input.inviteId,
      companyId: input.companyId,
    },
    data: { revokedAt: new Date() },
  });
}

export async function countActiveMemberships(db: Db, companyId: string) {
  return db.membership.count({
    where: {
      companyId,
      deletedAt: null,
      status: { not: "suspended" },
    },
  });
}
