"use client";

import type { AppDefinition } from "@plotkeys/app-store/registry";
import { resolveActiveApp } from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";
import { SiteNav, useSiteNav } from "@plotkeys/site-nav";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { SignOutButton } from "../auth/sign-out-button";

type DashboardSidebarProps = {
  enabledApps: readonly AppDefinition[];
};

export function DashboardSidebar({ enabledApps }: DashboardSidebarProps) {
  const pathname = usePathname() ?? "/";
  const { isExpanded } = useSiteNav();
  const activeApp = resolveActiveApp(pathname, enabledApps);

  const headerIcon = activeApp?.icon;
  const headerLabel = activeApp?.label ?? "PlotKeys OS";
  const headerSubtitle = activeApp ? "Active App" : "Workspace";

  return (
    <SiteNav.Sidebar>
      <div className="absolute left-0 top-0 z-10 flex h-[70px] w-full items-center border-b border-sidebar-border bg-sidebar/95 shadow-sm backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
        <div className="pointer-events-none absolute inset-x-5 bottom-0 h-px bg-sidebar-border" />
        <div
          className={
            isExpanded
              ? "flex min-w-0 items-center gap-3 px-5"
              : "flex w-[83px] items-center justify-center"
          }
        >
          <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl border border-sidebar-border bg-sidebar-accent/70 text-sidebar-foreground">
            {headerIcon ? (
              <RegistryIcon name={headerIcon} className="size-4" />
            ) : (
              <PlotKeysLogo markClassName="h-6" showWordmark={false} />
            )}
          </div>
          {isExpanded ? (
            <div className="min-w-0">
              <p className="truncate text-[11px] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/55">
                {headerSubtitle}
              </p>
              <p className="truncate text-sm font-semibold text-sidebar-foreground">
                {headerLabel}
              </p>
            </div>
          ) : null}
        </div>
      </div>
      <div className="absolute bottom-5 left-0 right-0 z-10 flex w-full items-center justify-center px-3 md:justify-start">
        <div
          className={
            isExpanded
              ? "w-full rounded-[22px] border border-sidebar-border bg-sidebar-accent/70 p-1 shadow-sm backdrop-blur-xl"
              : "flex w-full justify-center"
          }
        >
          <SignOutButton
            className={
              isExpanded
                ? "h-12 w-full justify-start rounded-[18px] text-sidebar-foreground hover:bg-sidebar-accent"
                : "size-10 rounded-2xl p-0 text-sidebar-foreground hover:bg-sidebar-accent"
            }
            icon={<LogOut className="size-4" />}
            showLabel={isExpanded}
          />
        </div>
      </div>
    </SiteNav.Sidebar>
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
