"use client";

import { cn } from "@plotkeys/utils";
import type { ReactNode } from "react";
import { useSiteNav } from "./use-site-nav";

export function SidebarShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { linkModules } = useSiteNav();

  return (
    <div className={cn(className, !linkModules.noSidebar && "md:ml-[70px]")}>
      {children}
    </div>
  );
}
