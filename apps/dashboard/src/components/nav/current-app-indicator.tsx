"use client";

import type { AppDefinition } from "@plotkeys/app-store/registry";
import { resolveActiveApp } from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";
import { usePathname } from "next/navigation";

type CurrentAppIndicatorProps = {
  apps: readonly AppDefinition[];
};

export function CurrentAppIndicator({ apps }: CurrentAppIndicatorProps) {
  const pathname = usePathname() ?? "/";
  const activeApp = resolveActiveApp(pathname, apps);

  const label = activeApp?.label ?? "Dashboard";
  const iconName = activeApp?.icon ?? "Home";

  return (
    <div className="flex items-center gap-2 text-sm font-medium text-foreground">
      <RegistryIcon name={iconName} className="size-4 text-muted-foreground" />
      <span className="truncate">{label}</span>
    </div>
  );
}
