import type { Prisma } from "../generated/prisma/client";
import { createPrismaClient, type Db } from "../prisma";

export type NotificationBellDataResult =
  | {
      data: {
        recent: Awaited<ReturnType<typeof listNotificationsForUser>>["data"];
        unreadCount: number;
      };
      ok: true;
    }
  | { ok: false; reason: "database-unavailable" };

export async function createNotification(
  db: Db,
  input: {
    companyId: string;
    userId: string;
    type: string;
    title: string;
    body?: string;
    link?: string;
  },
) {
  return db.notification.create({
    data: {
      companyId: input.companyId,
      userId: input.userId,
      type: input.type,
      title: input.title,
      body: input.body ?? null,
      link: input.link ?? null,
    },
  });
}

export async function listNotificationsForUser(
  db: Db,
  input: {
    companyId: string;
    cursor?: string | number | null;
    userId: string;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    take?: number;
    onlyUnread?: boolean;
  },
) {
  const query = input.q?.trim();
  const size = normalizePageSize(input.size ?? input.take);
  const offset = normalizeCursor(input.cursor);
  const where: Prisma.NotificationWhereInput = {
    companyId: input.companyId,
    userId: input.userId,
    ...(input.onlyUnread ? { isRead: false } : {}),
    ...(query ? { OR: getNotificationSearchFilters(query) } : {}),
  };

  const [count, data] = await db.$transaction([
    db.notification.count({ where }),
    db.notification.findMany({
      orderBy: getNotificationOrderBy(input.sort),
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

function getNotificationSearchFilters(
  query: string,
): Prisma.NotificationWhereInput[] {
  return [
    { body: { contains: query, mode: "insensitive" } },
    { link: { contains: query, mode: "insensitive" } },
    { title: { contains: query, mode: "insensitive" } },
    { type: { contains: query, mode: "insensitive" } },
  ];
}

function getNotificationOrderBy(
  sort: string[] | null | undefined,
): Prisma.NotificationOrderByWithRelationInput {
  const [field, value] = sort ?? [];
  const direction = value === "asc" || value === "desc" ? value : null;

  if (!direction) {
    return { createdAt: "desc" };
  }

  switch (field) {
    case "createdAt":
      return { createdAt: direction };
    case "isRead":
      return { isRead: direction };
    case "title":
      return { title: direction };
    case "type":
      return { type: direction };
    default:
      return { createdAt: "desc" };
  }
}

export async function countUnreadNotifications(
  db: Db,
  input: { companyId: string; userId: string },
) {
  return db.notification.count({
    where: {
      companyId: input.companyId,
      userId: input.userId,
      isRead: false,
    },
  });
}

export async function getNotificationBellDataForUser(input: {
  companyId: string;
  userId: string;
  take?: number;
}): Promise<NotificationBellDataResult> {
  const db = createPrismaClient().db;

  if (!db) {
    return { ok: false, reason: "database-unavailable" };
  }

  const [unreadCount, recentPage] = await Promise.all([
    countUnreadNotifications(db, input),
    listNotificationsForUser(db, {
      companyId: input.companyId,
      take: input.take ?? 5,
      userId: input.userId,
    }),
  ]);

  return {
    data: {
      recent: recentPage.data,
      unreadCount,
    },
    ok: true,
  };
}

export async function markNotificationRead(
  db: Db,
  input: { notificationId: string; userId: string },
) {
  return db.notification.update({
    where: {
      id: input.notificationId,
      userId: input.userId,
    },
    data: { isRead: true },
  });
}

export async function markAllNotificationsRead(
  db: Db,
  input: { companyId: string; userId: string },
) {
  return db.notification.updateMany({
    where: {
      companyId: input.companyId,
      userId: input.userId,
      isRead: false,
    },
    data: { isRead: true },
  });
}
