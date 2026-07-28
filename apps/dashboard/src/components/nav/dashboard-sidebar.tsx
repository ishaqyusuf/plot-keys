"use client";

import { SiteNav, useSiteNav } from "@plotkeys/site-nav";
import { cn } from "@plotkeys/ui/cn";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import { TenantLink } from "./tenant-link";

export function DashboardSidebar() {
  const { isExpanded } = useSiteNav();

  return (
    <SiteNav.Sidebar>
      <div
        className={cn(
          "absolute top-0 left-0 z-10 h-[70px] flex items-center justify-center bg-background border-b border-border transition-all duration-200 ease-[cubic-bezier(0.4,0,0.2,1)]",
          isExpanded ? "w-full" : "w-[69px]",
        )}
      >
        <TenantLink href="/" className="absolute left-[22px] transition-none">
          <PlotKeysLogo markClassName="h-6" showWordmark={false} />
        </TenantLink>
      </div>
    </SiteNav.Sidebar>
  );
}
