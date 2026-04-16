"use client";

import type { AppDefinition } from "@plotkeys/app-store/registry";
import { resolveActiveApp } from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@plotkeys/ui/tooltip";
import { Store } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type AppRailProps = {
  enabledApps: readonly AppDefinition[];
};

export function AppRail({ enabledApps }: AppRailProps) {
  const pathname = usePathname();
  const activeApp = resolveActiveApp(pathname ?? "/", enabledApps);

  return (
    <TooltipProvider delayDuration={100}>
      <aside className="flex w-14 shrink-0 flex-col items-center gap-1 border-r border-sidebar-border bg-sidebar py-3">
        {enabledApps.map((app) => {
          const isActive = activeApp?.id === app.id;
          return (
            <Tooltip key={app.id}>
              <TooltipTrigger asChild>
                <Link
                  href={app.homeRoute}
                  aria-label={app.label}
                  data-active={isActive || undefined}
                  className="flex size-10 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground"
                >
                  <RegistryIcon name={app.icon} className="size-5" />
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{app.label}</TooltipContent>
            </Tooltip>
          );
        })}

        <div className="mt-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/app-store"
                aria-label="App Store"
                className="flex size-10 items-center justify-center rounded-md text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <Store className="size-5" />
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">App Store</TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  );
}
