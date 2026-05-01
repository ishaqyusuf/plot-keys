"use client";

import type {
  AppDefinition,
  GlobalNavSection,
} from "@plotkeys/app-store/registry";
import { SiteNav, useCreateSiteNavContext } from "@plotkeys/site-nav";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { getVisibleDashboardNav } from "../../features/navigation/lib";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardTopbar } from "./dashboard-topbar";

type DashboardChromeProps = {
  children: ReactNode;
  companyName: string;
  enabledApps: readonly AppDefinition[];
  globalTop: GlobalNavSection;
  platformGroup: GlobalNavSection;
  recentNotifications: Array<{
    body: string | null;
    createdAt: string;
    id: string;
    isRead: boolean;
    link: string | null;
    title: string;
    type: string;
  }>;
  unreadCount: number;
  userName: string;
  workRoleLabel: string;
};

export function DashboardChrome({
  children,
  companyName,
  enabledApps,
  globalTop,
  platformGroup,
  recentNotifications,
  unreadCount,
  userName,
  workRoleLabel,
}: DashboardChromeProps) {
  const pathname = usePathname() ?? "/";
  const isBuilderRoute =
    pathname === "/builder" || pathname.startsWith("/builder/");
  const modules = getVisibleDashboardNav({
    enabledApps,
    globalTop,
    platformGroup,
  });
  const siteNav = useCreateSiteNavContext({
    Link,
    linkModules: modules,
    pathName: pathname,
  });

  if (isBuilderRoute) {
    return (
      <div className="relative flex min-h-svh flex-1 flex-col">
        <div className="relative">{children}</div>
      </div>
    );
  }

  return (
    <SiteNav.Provider value={siteNav}>
      <DashboardSidebar enabledApps={enabledApps} />
      <div className="relative flex min-h-svh flex-1 flex-col md:ml-[84px]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,107,97,0.04),transparent_26%),radial-gradient(circle_at_right_14%_top_8%,rgba(184,138,68,0.045),transparent_22%)]" />
        <DashboardTopbar
          companyName={companyName}
          enabledApps={enabledApps}
          globalTop={globalTop}
          platformGroup={platformGroup}
          recentNotifications={recentNotifications}
          unreadCount={unreadCount}
          userName={userName}
          workRoleLabel={workRoleLabel}
        />
        <div className="relative">{children}</div>
      </div>
    </SiteNav.Provider>
  );
}
