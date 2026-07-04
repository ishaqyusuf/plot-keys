import type { Agent, Employee, Prisma } from "../generated/prisma/client";
import {
  MembershipRole as MembershipRoleEnum,
  MembershipStatus as MembershipStatusEnum,
  WorkRole as WorkRoleEnum,
  type MembershipRole,
  type MembershipStatus,
  type WorkRole,
} from "../generated/prisma/enums";
import { createPrismaClient, type Db } from "../prisma";
import { findUserByEmail } from "./auth";

const INVITE_TTL_HOURS = 72;

function resolveDefaultWorkRoleForMembershipRole(role: MembershipRole) {
  if (role === "agent") {
    return "sales_agent" as WorkRole;
  }

  if (role === "owner" || role === "platform_admin") {
    return "executive" as WorkRole;
  }

  return "operations" as WorkRole;
}

function generateInviteToken(): string {
  return (
    crypto.randomUUID().replace(/-/g, "") +
    crypto.randomUUID().replace(/-/g, "")
  );
}

export async function listMembershipsForCompany(
  db: Db,
  companyId: string,
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
  const where: Prisma.MembershipWhereInput = {
    companyId,
    deletedAt: null,
    ...(query ? { OR: getMembershipSearchFilters(query) } : {}),
  };

  const [count, data] = await db.$transaction([
    db.membership.count({ where }),
    db.membership.findMany({
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
      orderBy: getMembershipOrderBy(options.sort),
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

function getMembershipSearchFilters(
  query: string,
): Prisma.MembershipWhereInput[] {
  const filters: Prisma.MembershipWhereInput[] = [
    {
      user: { is: { email: { contains: query, mode: "insensitive" } } },
    },
    {
      user: { is: { name: { contains: query, mode: "insensitive" } } },
    },
  ];

  if (isMembershipRoleValue(query)) {
    filters.push({ role: { equals: query } });
  }

  if (isMembershipStatusValue(query)) {
    filters.push({ status: { equals: query } });
  }

  if (isWorkRoleValue(query)) {
    filters.push({ workRole: { equals: query } });
  }

  return filters;
}

function getMembershipOrderBy(
  sort: string[] | null | undefined,
): Prisma.MembershipOrderByWithRelationInput[] {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return [{ role: "asc" }, { createdAt: "asc" }];
  }

  switch (field) {
    case "createdAt":
      return [{ createdAt: direction }];
    case "email":
      return [{ user: { email: direction } }];
    case "name":
      return [{ user: { name: direction } }];
    case "role":
      return [{ role: direction }];
    case "status":
      return [{ status: direction }];
    case "workRole":
      return [{ workRole: direction }];
    default:
      return [{ role: "asc" }, { createdAt: "asc" }];
  }
}

function isMembershipRoleValue(value: string): value is MembershipRole {
  return Object.values(MembershipRoleEnum).includes(value as MembershipRole);
}

function isMembershipStatusValue(value: string): value is MembershipStatus {
  return Object.values(MembershipStatusEnum).includes(
    value as MembershipStatus,
  );
}

function isWorkRoleValue(value: string): value is WorkRole {
  return Object.values(WorkRoleEnum).includes(value as WorkRole);
}

export async function createTeamInvite(
  db: Db,
  input: {
    companyId: string;
    email: string;
    role: MembershipRole;
    workRole?: WorkRole | null;
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

export type TeamInviteJoinPageDataResult =
  | { ok: false; reason: "database-unavailable" | "invite-not-found" }
  | {
      invite: NonNullable<Awaited<ReturnType<typeof findTeamInviteByToken>>>;
      ok: true;
    };

export async function getTeamInviteJoinPageData(
  token: string,
): Promise<TeamInviteJoinPageDataResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const invite = await findTeamInviteByToken(db, token);

  if (!invite) {
    return { ok: false, reason: "invite-not-found" };
  }

  return { invite, ok: true };
}

export type TeamInviteProfileCompletionDataResult =
  | {
      ok: false;
      reason:
        | "database-unavailable"
        | "email-mismatch"
        | "invite-not-accepted"
        | "invite-not-found"
        | "unsupported-role";
    }
  | {
      agentProfile: Agent | null;
      employeeProfile: Employee | null;
      invite: NonNullable<Awaited<ReturnType<typeof findTeamInviteByToken>>>;
      ok: true;
    };

export type CompleteTeamInviteProfileResult =
  | {
      ok: false;
      reason:
        | "database-unavailable"
        | "email-mismatch"
        | "invite-not-accepted"
        | "invite-not-found"
        | "unsupported-role";
    }
  | { ok: true; profileKind: "agent" | "staff" };

export type TeamInviteSignupDataResult =
  | {
      ok: false;
      reason:
        | "database-unavailable"
        | "invite-accepted"
        | "invite-expired"
        | "invite-not-found"
        | "invite-revoked"
        | "user-exists";
    }
  | {
      email: string;
      invite: NonNullable<Awaited<ReturnType<typeof findTeamInviteByToken>>>;
      ok: true;
    };

export type AcceptTeamInviteResult =
  | { ok: true }
  | { ok: false; reason: "database-unavailable" };

export async function getTeamInviteProfileCompletionData(input: {
  token: string;
  userEmail: string;
}): Promise<TeamInviteProfileCompletionDataResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const invite = await findTeamInviteByToken(db, input.token);

  if (!invite) {
    return { ok: false, reason: "invite-not-found" };
  }

  if (invite.email.toLowerCase() !== input.userEmail.toLowerCase()) {
    return { ok: false, reason: "email-mismatch" };
  }

  if (!invite.acceptedAt) {
    return { ok: false, reason: "invite-not-accepted" };
  }

  if (invite.role !== "agent" && invite.role !== "staff") {
    return { ok: false, reason: "unsupported-role" };
  }

  const isAgentInvite = invite.role === "agent";
  const [agentProfile, employeeProfile] = await Promise.all([
    isAgentInvite
      ? db.agent.findFirst({
          where: {
            companyId: invite.companyId,
            deletedAt: null,
            email: invite.email,
          },
        })
      : Promise.resolve(null),
    !isAgentInvite
      ? db.employee.findFirst({
          where: {
            companyId: invite.companyId,
            deletedAt: null,
            email: invite.email,
          },
        })
      : Promise.resolve(null),
  ]);

  return {
    agentProfile,
    employeeProfile,
    invite,
    ok: true,
  };
}

export async function completeTeamInviteProfile(input: {
  bio?: string | null;
  imageUrl?: string | null;
  name: string;
  phone?: string | null;
  title: string;
  token: string;
  userEmail: string;
}): Promise<CompleteTeamInviteProfileResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const invite = await findTeamInviteByToken(db, input.token);

  if (!invite) {
    return { ok: false, reason: "invite-not-found" };
  }

  if (invite.email.toLowerCase() !== input.userEmail.toLowerCase()) {
    return { ok: false, reason: "email-mismatch" };
  }

  if (!invite.acceptedAt) {
    return { ok: false, reason: "invite-not-accepted" };
  }

  if (invite.role === "agent") {
    const existingAgent = await db.agent.findFirst({
      where: {
        companyId: invite.companyId,
        deletedAt: null,
        email: invite.email,
      },
    });

    const data = {
      bio: input.bio ?? null,
      imageUrl: input.imageUrl ?? null,
      name: input.name,
      phone: input.phone ?? null,
      title: input.title,
    };

    if (existingAgent) {
      await db.agent.update({
        data,
        where: { id: existingAgent.id },
      });
    } else {
      await db.agent.create({
        data: {
          ...data,
          companyId: invite.companyId,
          email: invite.email,
        },
      });
    }

    return { ok: true, profileKind: "agent" };
  }

  if (invite.role === "staff") {
    const existingEmployee = await db.employee.findFirst({
      where: {
        companyId: invite.companyId,
        deletedAt: null,
        email: invite.email,
      },
    });

    const data = {
      name: input.name,
      phone: input.phone ?? null,
      title: input.title,
      workRole: invite.workRole,
    };

    if (existingEmployee) {
      await db.employee.update({
        data,
        where: { id: existingEmployee.id },
      });
    } else {
      await db.employee.create({
        data: {
          ...data,
          companyId: invite.companyId,
          email: invite.email,
        },
      });
    }

    return { ok: true, profileKind: "staff" };
  }

  return { ok: false, reason: "unsupported-role" };
}

export async function getTeamInviteSignupData(
  token: string,
): Promise<TeamInviteSignupDataResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const invite = await findTeamInviteByToken(db, token);

  if (!invite) {
    return { ok: false, reason: "invite-not-found" };
  }

  if (invite.acceptedAt) {
    return { ok: false, reason: "invite-accepted" };
  }

  if (invite.revokedAt) {
    return { ok: false, reason: "invite-revoked" };
  }

  if (invite.expiresAt < new Date()) {
    return { ok: false, reason: "invite-expired" };
  }

  const email = invite.email.trim().toLowerCase();
  const existingUser = await findUserByEmail(db, email);

  if (existingUser) {
    return { ok: false, reason: "user-exists" };
  }

  return {
    email,
    invite,
    ok: true,
  };
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

export async function acceptTeamInviteForUser(input: {
  token: string;
  userId: string;
}): Promise<AcceptTeamInviteResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  await acceptTeamInvite(db, input);

  return { ok: true };
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
