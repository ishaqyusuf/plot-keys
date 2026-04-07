import { createPrismaClient } from "@plotkeys/db";
import { getInstalledAppKeys } from "@plotkeys/db/queries/company-apps";
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
import { DEFAULT_APP_KEYS } from "../../lib/app-registry";
import { getNotificationBellData } from "../../lib/notifications";
import { requireOnboardedSession } from "../../lib/session";

export default async function DashboardAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [bellData, session] = await Promise.all([
    getNotificationBellData(),
    requireOnboardedSession(),
  ]);

  const companyId = session.activeMembership.companyId;
  const prisma = createPrismaClient().db;

  let installedAppKeys: string[] = DEFAULT_APP_KEYS;
  if (prisma) {
    try {
      const keys = await getInstalledAppKeys(prisma, companyId);
      if (keys.length > 0) installedAppKeys = keys;
    } catch {
      // Table may not exist yet (pending migration) — fall back to defaults
    }
  }

  return (
    <SidebarProvider>
      <DashboardSidebar installedAppKeys={installedAppKeys} />
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
