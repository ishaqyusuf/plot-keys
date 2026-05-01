"use client";

import { useState } from "react";
import { NavsList } from "./navs-list";
import { useSiteNav } from "./use-site-nav";

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M4 6.5h12M4 10h12M4 13.5h12"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="m6 6 8 8M14 6l-8 8"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.6"
      />
    </svg>
  );
}

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { linkModules } = useSiteNav();

  if (linkModules.noSidebar) {
    return null;
  }

  return (
    <div className="md:hidden">
      <button
        aria-label="Open navigation"
        className="relative flex size-8 items-center justify-center rounded-full border border-border bg-background/70 text-foreground transition-colors hover:bg-background"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <MenuIcon className="size-4" />
      </button>
      {isOpen ? (
        <div aria-modal="true" className="fixed inset-0 z-50" role="dialog">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <div className="absolute inset-y-0 left-0 flex w-[min(100vw,22rem)] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground shadow-xl">
            <div className="h-[70px] border-b border-sidebar-border px-5 py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-sidebar-foreground/55">
                Workspace
              </p>
              <p className="mt-1 truncate text-sm font-semibold text-sidebar-foreground">
                PlotKeys OS
              </p>
              <button
                aria-label="Close navigation"
                className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <CloseIcon className="size-4" />
              </button>
            </div>
            <div className="h-[calc(100vh-70px)] overflow-y-auto pb-10 pt-3">
              <NavsList mobile onSelect={() => setIsOpen(false)} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
