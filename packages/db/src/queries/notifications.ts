import type { Prisma } from "../generated/prisma/client";
import type { Db } from "../prisma";
import {
  createPaginatedListResult,
  normalizeListOffsetCursor,
  normalizeListPageSize,
} from "./list-contract";

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
    end?: string | null;
    userId: string;
    q?: string | null;
    size?: string | number | null;
    sort?: string[] | null;
    start?: string | null;
    take?: number;
    onlyUnread?: boolean;
  },
) {
  const endDate = parseDateBoundary(input.end, "end");
  const query = input.q?.trim();
  const size = normalizeListPageSize(input.size ?? input.take);
  const offset = normalizeListOffsetCursor(input.cursor);
  const startDate = parseDateBoundary(input.start, "start");
  const createdAtFilter: Prisma.DateTimeFilter | undefined =
    endDate || startDate
      ? {
          ...(endDate ? { lte: endDate } : {}),
          ...(startDate ? { gte: startDate } : {}),
        }
      : undefined;
  const where: Prisma.NotificationWhereInput = {
    companyId: input.companyId,
    ...(createdAtFilter ? { createdAt: createdAtFilter } : {}),
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

export async function getNotificationBellDataForUser(
  db: Db,
  input: {
    companyId: string;
    userId: string;
    take?: number;
  },
) {
  const [unreadCount, recentPage] = await Promise.all([
    countUnreadNotifications(db, input),
    listNotificationsForUser(db, {
      companyId: input.companyId,
      take: input.take ?? 5,
      userId: input.userId,
    }),
  ]);

  return {
    recent: recentPage.data,
    unreadCount,
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
