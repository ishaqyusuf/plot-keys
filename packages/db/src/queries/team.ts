import type { Agent, Employee, Prisma } from "../generated/prisma/client";
import {
  type MembershipRole,
  MembershipRole as MembershipRoleEnum,
  type MembershipStatus,
  MembershipStatus as MembershipStatusEnum,
  type WorkRole,
  WorkRole as WorkRoleEnum,
} from "../generated/prisma/enums";
import type { Db } from "../prisma";
import { assertQaCompanyIdentity } from "./qa-maintenance";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

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
    end?: string | null;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    start?: string | null;
  } = {},
) {
  const endDate = parseDateBoundary(options.end, "end");
  const query = options.q?.trim();
  const size = normalizeListPageSize(options.size);
  const offset = normalizeListOffsetCursor(options.cursor);
  const startDate = parseDateBoundary(options.start, "start");
  const createdAtFilter: Prisma.DateTimeFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;
  const where: Prisma.MembershipWhereInput = {
    companyId,
    ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
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
  return createPaginatedListResult(data, { count, offset, size });
}

function parseDateBoundary(
  value: string | null | undefined,
  boundary: "end" | "start",
) {
  if (!value) return null;

  const suffix = boundary === "start" ? "T00:00:00.000Z" : "T23:59:59.999Z";
  const date = new Date(`${value}${suffix}`);

  return Number.isNaN(date.getTime()) ? null : date;
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
  await assertQaCompanyIdentity(db, {
    companyId: input.companyId,
    email: input.email,
  });

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

export type TeamInviteProfileCompletionDataResult =
  | {
      ok: false;
      reason:
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
        | "email-mismatch"
        | "invite-not-accepted"
        | "invite-not-found"
        | "unsupported-role";
    }
  | { ok: true; profileKind: "agent" | "staff" };

export async function getTeamInviteProfileCompletionData(
  db: Db,
  input: {
    token: string;
    userEmail: string;
  },
): Promise<TeamInviteProfileCompletionDataResult> {
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

export async function completeTeamInviteProfile(
  db: Db,
  input: {
    bio?: string | null;
    imageUrl?: string | null;
    name: string;
    phone?: string | null;
    title: string;
    token: string;
    userEmail: string;
  },
): Promise<CompleteTeamInviteProfileResult> {
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

export async function findMembershipForUser(
  db: Db,
  input: { companyId: string; userId: string },
) {
  return db.membership.findFirst({
    where: {
      companyId: input.companyId,
      deletedAt: null,
      userId: input.userId,
    },
  });
}

export async function findMembershipById(db: Db, membershipId: string) {
  return db.membership.findUnique({
    where: { id: membershipId },
  });
}

export async function listMembershipRemovalTargets(
  db: Db,
  input: { companyId: string; membershipIds: string[] },
) {
  return db.membership.findMany({
    select: {
      id: true,
      role: true,
      userId: true,
    },
    where: {
      companyId: input.companyId,
      deletedAt: null,
      id: { in: input.membershipIds },
    },
  });
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
