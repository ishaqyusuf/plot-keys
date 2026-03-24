import type { Db } from "../prisma";

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
    userId: string;
    take?: number;
    onlyUnread?: boolean;
  },
) {
  return db.notification.findMany({
    where: {
      companyId: input.companyId,
      userId: input.userId,
      ...(input.onlyUnread ? { isRead: false } : {}),
    },
    orderBy: { createdAt: "desc" },
    take: input.take ?? 50,
  });
}

export async function countUnreadNotifications(
  db: Db,
  input: { companyId: string; userId: string },
) {
  // db.notification

  return db.notification.count({
    where: {
      companyId: input.companyId,
      userId: input.userId,
      isRead: false,
    },
  });
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
