"use client";

import type {
  AppDefinition,
  GlobalNavSection,
} from "@plotkeys/app-store/registry";
import { SiteNav, useCreateSiteNavContext } from "@plotkeys/site-nav";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import { buildSandboxUrl } from "@plotkeys/utils/app-urls";
import { usePathname } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { OpenSearchButton } from "@/components/search/open-search-button";
import { GlobalSheetsProvider } from "@/components/sheets/global-sheets-provider";
import { getVisibleDashboardNav } from "@/features/navigation/lib";
import { DashboardSidebar } from "./dashboard-sidebar";
import { DashboardUserMenu } from "./dashboard-user-menu";
import { NotificationBell } from "./notification-bell";
import { TenantLink } from "./tenant-link";

type Props = {
  children: ReactNode;
  companyName: string;
  enabledApps: readonly AppDefinition[];
  globalTop: GlobalNavSection;
  platformGroup: GlobalNavSection;
  userName: string;
  workRoleLabel: string;
};

export function DashboardChrome({
  children,
  companyName,
  enabledApps,
  globalTop,
  platformGroup,
  userName,
  workRoleLabel,
}: Props) {
  const pathname = usePathname() ?? "/";
  const [sandboxUrl, setSandboxUrl] = useState(() => buildSandboxUrl());
  useEffect(() => {
    setSandboxUrl(buildSandboxUrl({ currentUrl: window.location.href }));
  }, []);
  const resolvedGlobalTop = useMemo(
    () => ({
      ...globalTop,
      items: globalTop.items.map((item) =>
        item.externalApp === "sandbox" ? { ...item, href: sandboxUrl } : item,
      ),
    }),
    [globalTop, sandboxUrl],
  );
  const isBuilderRoute =
    pathname === "/builder" || pathname.startsWith("/builder/");
  const modules = getVisibleDashboardNav({
    enabledApps,
    globalTop: resolvedGlobalTop,
    platformGroup,
  });
  const siteNav = useCreateSiteNavContext({
    Link: TenantLink,
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
      <DashboardSidebar />
      <div className="pb-4 md:ml-[70px]">
        <SiteNav.Header
          left={<OpenSearchButton />}
          right={
            <div className="flex space-x-2 ml-auto">
              <NotificationBell />
              <ThemeToggle />
              <DashboardUserMenu
                companyName={companyName}
                userName={userName}
                workRoleLabel={workRoleLabel}
              />
            </div>
          }
        />
        <div className="px-4 md:px-8">{children}</div>
      </div>
      <GlobalSheetsProvider />
    </SiteNav.Provider>
  );
}
