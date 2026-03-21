import { createPrismaClient } from "@plotkeys/db";
import { Separator } from "@plotkeys/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@plotkeys/ui/sidebar";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import type { ReactNode } from "react";

import { DashboardSidebar } from "../../components/nav/dashboard-sidebar";
import { NotificationBell } from "../../components/nav/notification-bell";
import { getCurrentAppSession } from "../../lib/session";

async function getNotificationBellData() {
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

export default async function DashboardAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const bellData = await getNotificationBellData();

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <div className="flex flex-1 items-center justify-end gap-2">
            <NotificationBell
              unreadCount={bellData.unreadCount}
              recentNotifications={bellData.recent}
            />
            <ThemeToggle />
          </div>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
