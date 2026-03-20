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
  BarChart3Icon,
  BellIcon,
  BotIcon,
  BriefcaseIcon,
  BuildingIcon,
  CalendarIcon,
  CreditCardIcon,
  GlobeIcon,
  LayoutDashboardIcon,
  LayoutTemplateIcon,
  LeafIcon,
  MessageCircleIcon,
  PaletteIcon,
  SettingsIcon,
  SparklesIcon,
  UsersIcon,
  Users2Icon,
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
    label: "Workspace",
    items: [
      { href: "/", icon: LayoutDashboardIcon, label: "Dashboard" },
      { href: "/builder", icon: LayoutTemplateIcon, label: "Site builder" },
      { href: "/analytics", icon: BarChart3Icon, label: "Analytics" },
    ],
  },
  {
    label: "Operations",
    items: [
      { href: "/properties", icon: BuildingIcon, label: "Properties" },
      { href: "/agents", icon: BriefcaseIcon, label: "Agents" },
      { href: "/leads", icon: MessageCircleIcon, label: "Leads" },
      { href: "/appointments", icon: CalendarIcon, label: "Appointments" },
    ],
  },
  {
    label: "Growth",
    items: [
      {
        badge: "AI",
        href: "/ai-credits",
        icon: SparklesIcon,
        label: "AI credits",
      },
      {
        badge: "Pro",
        href: "#",
        icon: BotIcon,
        label: "Chat-bot",
      },
      {
        badge: "Plus",
        href: "/customers",
        icon: UsersIcon,
        label: "Customers",
      },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/billing", icon: CreditCardIcon, label: "Billing" },
      { href: "/domains", icon: GlobeIcon, label: "Domains" },
      { href: "/team", icon: Users2Icon, label: "Team" },
      { href: "/notifications", icon: BellIcon, label: "Notifications" },
      {
        badge: "Coming",
        href: "#",
        icon: LeafIcon,
        label: "App store",
      },
      { href: "/settings", icon: SettingsIcon, label: "Settings" },
    ],
  },
];

type DashboardSidebarProps = {
  companyName: string;
  companySlug: string;
  planTier: string;
};

export function DashboardSidebar({
  companyName,
  companySlug,
  planTier,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="h-auto py-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              size="lg"
            >
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                  PK
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">{companyName}</span>
                  <span className="truncate text-xs capitalize text-muted-foreground">
                    {planTier} plan · {companySlug}
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
                  const isDisabled = item.href === "#";
                  return (
                    <SidebarMenuItem key={item.label}>
                      <SidebarMenuButton
                        asChild={!isDisabled}
                        isActive={isActive}
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
              <p className="mb-1 text-xs text-muted-foreground">
                {companySlug}.plotkeys.com
              </p>
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

// Mobile sidebar trigger re-export
export { PaletteIcon as NavIcon };
