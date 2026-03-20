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
import {
  BarChart3,
  Bell,
  Bot,
  Building2,
  Calendar,
  CreditCard,
  Globe,
  Home,
  LayoutDashboard,
  Mail,
  Paintbrush,
  Settings,
  Sparkles,
  Store,
  UserRoundCog,
  Users,
  UsersRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "../auth/sign-out-button";

type NavItem = {
  badge?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
};

type NavGroup = {
  items: NavItem[];
  label: string;
};

const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { href: "/", icon: Home, label: "Dashboard" },
      { href: "/builder", icon: Paintbrush, label: "Builder" },
      { href: "/live", icon: Globe, label: "Live Preview" },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/properties", icon: Building2, label: "Properties" },
      { href: "/agents", icon: UsersRound, label: "Agents" },
      { href: "/leads", icon: Mail, label: "Leads" },
      { href: "/appointments", icon: Calendar, label: "Appointments" },
      { href: "/customers", icon: Users, label: "Customers", badge: "Plus" },
    ],
  },
  {
    label: "Insights",
    items: [
      { href: "/analytics", icon: BarChart3, label: "Analytics" },
      { href: "/ai-credits", icon: Sparkles, label: "AI Credits", badge: "AI" },
      { href: "#", icon: Bot, label: "Chat-bot", badge: "Pro" },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/billing", icon: CreditCard, label: "Billing" },
      { href: "/domains", icon: Globe, label: "Domains" },
      { href: "/team", icon: UserRoundCog, label: "Team" },
      { href: "/notifications", icon: Bell, label: "Notifications" },
      { href: "/settings", icon: Settings, label: "Settings" },
      { href: "#", icon: Store, label: "App store", badge: "Coming" },
    ],
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <LayoutDashboard className="size-4" />
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
                    item.href !== "/" && item.href !== "#" && pathname.startsWith(item.href);
                  const isDisabled = item.href === "#";

                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild={!isDisabled}
                        isActive={isActive || startsWith}
                        tooltip={item.label}
                        className={isDisabled ? "cursor-not-allowed opacity-60" : undefined}
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
                      {item.badge ? <SidebarMenuBadge>{item.badge}</SidebarMenuBadge> : null}
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
