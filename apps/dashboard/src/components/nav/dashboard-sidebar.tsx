"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@plotkeys/ui/sidebar";
import { Icon } from "@plotkeys/ui/icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { DEFAULT_APP_KEYS, getActiveApps } from "../../lib/app-registry";
import { SignOutButton } from "../auth/sign-out-button";

type Props = {
  installedAppKeys?: string[];
};

export function DashboardSidebar({ installedAppKeys }: Props) {
  const pathname = usePathname();
  const keys = installedAppKeys ?? DEFAULT_APP_KEYS;
  const navGroups = getActiveApps(keys).map((app) => app.navGroup);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Icon.Dashboard className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">PlotKeys</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Dashboard
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {navGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = pathname === item.href;
                  const startsWith =
                    item.href !== "/" &&
                    item.href !== "#" &&
                    pathname.startsWith(item.href);
                  const isDisabled = item.href === "#";

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild={!isDisabled}
                        isActive={isActive || startsWith}
                        tooltip={item.label}
                        className={
                          isDisabled
                            ? "cursor-not-allowed opacity-60"
                            : undefined
                        }
                      >
                        {isDisabled ? (
                          <span className="flex items-center gap-2">
                            <item.icon className="size-4 shrink-0" />
                            <span>{item.label}</span>
                          </span>
                        ) : (
                          <Link href={item.href}>
                            <item.icon className="size-4 shrink-0" />
                            <span>{item.label}</span>
                          </Link>
                        )}
                      </SidebarMenuButton>
                      {item.badge ? (
                        <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="px-2 py-2">
              <SignOutButton />
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}

export function DashboardSidebarSkeleton() {
  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      <div className="px-4 py-4">
        <div className="h-8 w-32 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}
