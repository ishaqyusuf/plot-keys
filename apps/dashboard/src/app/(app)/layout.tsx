import { isWorkRole, WORK_ROLE_LABELS } from "@plotkeys/utils";
import type { ReactNode } from "react";

import { DashboardChrome } from "@/components/nav/dashboard-chrome";
import { TenantUrlProvider } from "@/components/nav/tenant-url-provider";
import { GlobalSheetsProvider } from "@/components/sheets/global-sheets-provider";
import {
  GLOBAL_PLATFORM_GROUP,
  GLOBAL_TOP_ITEMS,
  getCompanyAppsContext,
} from "@/lib/company-apps";
import { getNotificationBellData } from "@/lib/notifications";
import { requireOnboardedSession } from "@/lib/session";
import { getCurrentTenantUrlContext } from "@/lib/tenant-url-server";

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
  const tenantUrl = await getCurrentTenantUrlContext();

  return (
    <TenantUrlProvider config={tenantUrl.config} context={tenantUrl.context}>
      <div className="flex min-h-svh bg-transparent">
        <DashboardChrome
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
        >
          {children}
        </DashboardChrome>
        <GlobalSheetsProvider />
      </div>
    </TenantUrlProvider>
  );
}
