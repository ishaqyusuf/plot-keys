"use client";

import type {
  AppDefinition,
  GlobalNavSection,
} from "@plotkeys/app-store/registry";
import { resolveActiveApp } from "@plotkeys/app-store/registry";
import { SiteNav } from "@plotkeys/site-nav";
import { Badge } from "@plotkeys/ui/badge";
import { ThemeToggle } from "@plotkeys/ui/theme-toggle";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  getActiveDashboardNavItem,
  getCurrentDashboardModule,
  getDashboardQuickLinks,
  getVisibleDashboardNav,
} from "../../features/navigation/lib";
import { NotificationBell } from "./notification-bell";

type DashboardTopbarProps = {
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

export function DashboardTopbar({
  companyName,
  enabledApps,
  globalTop,
  platformGroup,
  recentNotifications,
  unreadCount,
  userName,
  workRoleLabel,
}: DashboardTopbarProps) {
  const pathname = usePathname() ?? "/";
  const activeApp = resolveActiveApp(pathname, enabledApps);
  const modules = getVisibleDashboardNav({
    activeApp,
    globalTop,
    platformGroup,
  });
  const currentModule = getCurrentDashboardModule(pathname, modules);
  const activeItem = getActiveDashboardNavItem(pathname, modules);
  const quickLinks = getDashboardQuickLinks(pathname, modules);

  const subtitle =
    currentModule?.subtitle ??
    activeApp?.description ??
    `${companyName} workspace`;
  const title =
    activeItem?.title ??
    currentModule?.title ??
    activeApp?.label ??
    "Dashboard";

  return (
    <div className="sticky top-0 z-30">
      <SiteNav.Header
        className="border-b-0 bg-transparent px-4 pb-3 pt-4 sm:px-6 lg:px-8"
        right={
          <div className="flex items-center gap-2">
            <NotificationBell
              unreadCount={unreadCount}
              recentNotifications={recentNotifications}
            />
            <ThemeToggle />
            <div className="hidden items-center gap-2 lg:flex">
              <Badge
                variant="outline"
                className="rounded-full border-border/55 bg-card/62 px-3 py-1 text-muted-foreground"
              >
                {workRoleLabel}
              </Badge>
              <Badge
                variant="secondary"
                className="rounded-full bg-foreground/[0.04] px-3 py-1 text-foreground"
              >
                {userName}
              </Badge>
            </div>
          </div>
        }
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground/72">
          {subtitle}
        </p>
        <div className="mt-1 flex items-center gap-2.5">
          <h1 className="truncate text-[20px] font-semibold tracking-[-0.045em] text-foreground sm:text-[22px]">
            {title}
          </h1>
          <Badge
            variant="outline"
            className="hidden rounded-full border-border/55 bg-card/62 px-2.5 py-0.5 text-[0.66rem] text-muted-foreground sm:inline-flex"
          >
            {companyName}
          </Badge>
        </div>
      </SiteNav.Header>

      <div className="border-b border-border/65 bg-[color:color-mix(in_srgb,var(--color-background)_88%,white_12%)]/88 px-4 py-2.5 backdrop-blur-xl sm:px-6 lg:px-8">
        <div className="flex gap-1.5 overflow-x-auto">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={[
                "rounded-full border px-3 py-1.5 text-[0.72rem] font-medium whitespace-nowrap transition-all duration-200",
                link.isActive
                  ? "border-foreground/10 bg-foreground/[0.06] text-foreground"
                  : "border-transparent bg-transparent text-muted-foreground hover:border-border/50 hover:bg-card/58 hover:text-foreground",
              ].join(" ")}
            >
              {link.title ?? link.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
