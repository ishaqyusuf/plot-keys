"use client";

import { Separator } from "@plotkeys/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@plotkeys/ui/sidebar";
import type { ReactNode } from "react";
import { DashboardSidebar } from "../nav/dashboard-sidebar";

type DashboardShellProps = {
  children: ReactNode;
  companyName: string;
  companySlug: string;
  planTier: string;
};

export function DashboardShell({
  children,
  companyName,
  companySlug,
  planTier,
}: DashboardShellProps) {
  return (
    <SidebarProvider>
      <DashboardSidebar
        companyName={companyName}
        companySlug={companySlug}
        planTier={planTier}
      />
      <SidebarInset>
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator className="mr-2 h-4" orientation="vertical" />
          <p className="text-sm font-medium text-foreground">{companyName}</p>
        </header>
        <div className="flex-1">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
