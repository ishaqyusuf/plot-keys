import {
  countUnreadNotifications,
  createPrismaClient,
  listNotificationsForUser,
} from "@plotkeys/db";
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
  // prisma.notification
  const [unreadCount, recent] = await Promise.all([
    countUnreadNotifications(prisma, { companyId, userId }),
    listNotificationsForUser(prisma, { companyId, userId, take: 5 }),
  ]);

  return {
    unreadCount,
    recent: recent.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
