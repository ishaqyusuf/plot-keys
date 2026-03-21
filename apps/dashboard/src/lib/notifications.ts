import { createPrismaClient } from "@plotkeys/db";
import { getCurrentAppSession } from "./session";

/**
 * Fetch notification bell data for the layout header.
 * Returns unread count and 5 most recent notifications.
 */
export async function getNotificationBellData() {
  const session = await getCurrentAppSession();
  if (!session?.activeMembership) return { unreadCount: 0, recent: [] };

  const prisma = createPrismaClient().db;
  if (!prisma) return { unreadCount: 0, recent: [] };

  const companyId = session.activeMembership.companyId;
  const userId = session.user.id;

  const [unreadCount, recent] = await Promise.all([
    prisma.notification.count({
      where: { companyId, userId, isRead: false },
    }),
    prisma.notification.findMany({
      where: { companyId, userId },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        body: true,
        type: true,
        link: true,
        isRead: true,
        createdAt: true,
      },
    }),
  ]);

  return {
    unreadCount,
    recent: recent.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
