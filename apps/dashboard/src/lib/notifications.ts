import { getNotificationBellDataForUser } from "@plotkeys/db/queries";
import { getCurrentAppSession } from "./session";

/**
 * Fetch notification bell data for the layout header.
 * Returns unread count and 5 most recent notifications.
 */
export async function getNotificationBellData() {
  const session = await getCurrentAppSession();
  if (!session?.activeMembership) return { unreadCount: 0, recent: [] };

  const result = await getNotificationBellDataForUser({
    companyId: session.activeMembership.companyId,
    take: 5,
    userId: session.user.id,
  });

  if (!result.ok) return { unreadCount: 0, recent: [] };

  return {
    unreadCount: result.data.unreadCount,
    recent: result.data.recent.map((n) => ({
      ...n,
      createdAt: n.createdAt.toISOString(),
    })),
  };
}
