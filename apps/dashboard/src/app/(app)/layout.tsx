import { isWorkRole, WORK_ROLE_LABELS } from "@plotkeys/utils";
import type { ReactNode } from "react";

import { DashboardSidebar } from "../../components/nav/dashboard-sidebar";
import { DashboardTopbar } from "../../components/nav/dashboard-topbar";
import {
  GLOBAL_PLATFORM_GROUP,
  GLOBAL_TOP_ITEMS,
  getCompanyAppsContext,
} from "../../lib/company-apps";
import { getNotificationBellData } from "../../lib/notifications";
import { requireOnboardedSession } from "../../lib/session";

export default async function DashboardAppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await requireOnboardedSession();

  const [bellData, appsContext] = await Promise.all([
    getNotificationBellData(),
    getCompanyAppsContext(),
  ]);

  return (
    <div className="flex min-h-svh bg-transparent">
      <DashboardSidebar
        enabledApps={appsContext.enabledApps}
        globalTop={GLOBAL_TOP_ITEMS}
        platformGroup={GLOBAL_PLATFORM_GROUP}
      />
      <div className="relative flex min-h-svh flex-1 flex-col lg:pl-24">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,107,97,0.04),transparent_26%),radial-gradient(circle_at_right_14%_top_8%,rgba(184,138,68,0.045),transparent_22%)]" />
        <DashboardTopbar
          companyName={session.activeMembership.companyName}
          enabledApps={appsContext.enabledApps}
          globalTop={GLOBAL_TOP_ITEMS}
          platformGroup={GLOBAL_PLATFORM_GROUP}
          recentNotifications={bellData.recent}
          unreadCount={bellData.unreadCount}
          userName={session.user.name ?? session.user.email ?? "Workspace user"}
          workRoleLabel={
            isWorkRole(session.activeMembership.workRole)
              ? WORK_ROLE_LABELS[session.activeMembership.workRole]
              : "Workspace"
          }
        />
        <div className="relative">{children}</div>
      </div>
    </div>
  );
}
