"use client";

import { cn } from "@plotkeys/utils";
import { type ReactNode, useEffect, useRef } from "react";
import { NavsList } from "./navs-list";
import { useSiteNav } from "./use-site-nav";

export function Sidebar({ children }: { children?: ReactNode }) {
  const { isExpanded, linkModules, mainMenuRef, setIsExpanded } = useSiteNav();
  const expandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    },
    [],
  );

  if (linkModules.noSidebar) {
    return null;
  }

  return (
    <aside
      className={cn(
        "fixed top-0 left-0 z-50 hidden h-screen flex-shrink-0 flex-col justify-between overflow-hidden border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] md:flex",
        isExpanded ? "w-[272px]" : "w-[84px]",
      )}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-6 top-[70px] h-px bg-sidebar-border" />
        <div className="absolute inset-y-0 right-0 w-px bg-sidebar-border/70" />
      </div>
      <nav
        aria-label="Primary navigation"
        ref={mainMenuRef}
        onMouseEnter={() => {
          if (expandTimeoutRef.current) {
            clearTimeout(expandTimeoutRef.current);
          }
          expandTimeoutRef.current = setTimeout(() => {
            setIsExpanded(true);
            expandTimeoutRef.current = null;
          }, 140);
        }}
        onMouseLeave={() => {
          if (expandTimeoutRef.current) {
            clearTimeout(expandTimeoutRef.current);
            expandTimeoutRef.current = null;
          }
          setIsExpanded(false);
        }}
        className="relative flex min-h-0 w-full flex-1 flex-col overflow-y-auto pb-[124px] pt-[70px]"
      >
        <NavsList />
      </nav>
      {children}
    </aside>
  );
}
