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
  SidebarMenuButton,
  SidebarMenuItem,
} from "@plotkeys/ui/sidebar";
import {
  BarChart3,
  Bot,
  Building2,
  Calendar,
  CreditCard,
  Globe,
  Home,
  LayoutDashboard,
  Mail,
  Paintbrush,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { SignOutButton } from "../auth/sign-out-button";

const navMain = [
  { title: "Dashboard", href: "/", icon: Home },
  { title: "Builder", href: "/builder", icon: Paintbrush },
  { title: "Live Preview", href: "/live", icon: Globe },
];

const navManage = [
  { title: "Properties", href: "/properties", icon: Building2 },
  { title: "Agents", href: "/agents", icon: Users },
  { title: "Leads", href: "/leads", icon: Mail },
  { title: "Appointments", href: "/appointments", icon: Calendar },
];

const navInsights = [
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "AI Credits", href: "/ai-credits", icon: Bot },
  { title: "Billing", href: "/billing", icon: CreditCard },
];

function NavGroup({
  label,
  items,
  pathname,
}: {
  label: string;
  items: { title: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
  pathname: string;
}) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href)
                }
                tooltip={item.title}
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

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
        <NavGroup label="Overview" items={navMain} pathname={pathname} />
        <NavGroup label="Manage" items={navManage} pathname={pathname} />
        <NavGroup label="Insights" items={navInsights} pathname={pathname} />
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SignOutButton />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
