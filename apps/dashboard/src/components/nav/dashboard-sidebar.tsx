"use client";

import type {
  AppDefinition,
  GlobalNavSection,
} from "@plotkeys/app-store/registry";
import { resolveActiveApp } from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";
import { createSiteNavContext, SiteNav } from "@plotkeys/site-nav";
import { Badge } from "@plotkeys/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { ChevronDown, LayoutDashboard, LogOut, Store } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { getVisibleDashboardNav } from "../../features/navigation/lib";
import { SignOutButton } from "../auth/sign-out-button";

type DashboardSidebarProps = {
  enabledApps: readonly AppDefinition[];
  globalTop: GlobalNavSection;
  platformGroup: GlobalNavSection;
};

export function DashboardSidebar({
  enabledApps,
  globalTop,
  platformGroup,
}: DashboardSidebarProps) {
  const pathname = usePathname() ?? "/";
  const router = useRouter();
  const activeApp = resolveActiveApp(pathname, enabledApps);
  const modules = getVisibleDashboardNav({
    activeApp,
    globalTop,
    platformGroup,
  });
  const siteNav = createSiteNavContext({
    Link,
    linkModules: modules,
    pathName: pathname,
  });

  const headerIcon = activeApp?.icon;
  const headerLabel = activeApp?.label ?? "PlotKeys";
  const headerSubtitle = activeApp ? "App" : "Dashboard";

  return (
    <SiteNav.Provider value={siteNav}>
      <SiteNav.Sidebar>
        <div className="border-b border-border/60 px-3 py-3">
          <div className="space-y-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-[1.2rem] border border-border/50 bg-card/68 px-3 py-3 text-left transition-all duration-200 hover:border-border/65 hover:bg-card/84"
                >
                  <div className="flex aspect-square size-10 items-center justify-center rounded-[1rem] bg-foreground/[0.042] text-foreground">
                    {headerIcon ? (
                      <RegistryIcon name={headerIcon} className="size-4" />
                    ) : (
                      <LayoutDashboard className="size-4" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold tracking-[-0.02em]">
                      {headerLabel}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {headerSubtitle}
                    </span>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-64 rounded-2xl">
                <DropdownMenuLabel>Switch App</DropdownMenuLabel>
                {enabledApps.map((app) => (
                  <DropdownMenuItem
                    key={app.id}
                    onSelect={() => router.push(app.homeRoute)}
                  >
                    <RegistryIcon name={app.icon} className="size-4 shrink-0" />
                    <span>{app.label}</span>
                    {activeApp?.id === app.id ? (
                      <span className="ml-auto text-xs text-muted-foreground">
                        Current
                      </span>
                    ) : null}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => router.push("/app-store")}>
                  <Store className="size-4 shrink-0" />
                  <span>App Store</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div
              className={
                siteNav.isExpanded
                  ? "space-y-2 px-1"
                  : "flex flex-col items-center gap-2"
              }
            >
              {siteNav.isExpanded ? (
                <div className="rounded-[1.2rem] border border-border/50 bg-card/58 px-3 py-3">
                  <p className="text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/70">
                    Workspace
                  </p>
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-foreground">
                      PlotKeys OS
                    </span>
                    <Badge
                      variant="outline"
                      className="rounded-full border-border/60 bg-background/55 px-2.5 py-0.5 text-[0.68rem]"
                    >
                      Live
                    </Badge>
                  </div>
                </div>
              ) : null}
              <div className={siteNav.isExpanded ? "" : "w-full"}>
                <SignOutButton
                  className={
                    siteNav.isExpanded
                      ? "w-full justify-start rounded-2xl"
                      : "size-10 rounded-2xl p-0"
                  }
                  icon={
                    siteNav.isExpanded ? (
                      <LogOut className="size-4" />
                    ) : undefined
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </SiteNav.Sidebar>
    </SiteNav.Provider>
  );
}

export function DashboardSidebarSkeleton() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border/60 bg-sidebar">
      <div className="px-4 py-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
