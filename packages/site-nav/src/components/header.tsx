"use client";

import { cn } from "@plotkeys/utils";
import type { ReactNode } from "react";
import { MobileSidebar } from "./mobile-sidebar";

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
  left?: ReactNode;
  mobileMenu?: boolean;
  right?: ReactNode;
};

export function Header({
  children,
  className,
  left,
  mobileMenu = true,
  right,
}: HeaderProps) {
  return (
    <header
      className={cn(
        "top-0 z-50 flex h-[70px] items-center justify-between gap-4 bg-background/70 px-6 backdrop-blur-xl transition-transform md:border-b md:backdrop-blur-none",
        className,
      )}
      style={{
        transform: "translateY(calc(var(--header-offset, 0px) * -1))",
        transitionDuration: "var(--header-transition, 200ms)",
        willChange: "transform",
      }}
    >
      {mobileMenu ? (
        <div className="md:hidden">
          <MobileSidebar />
        </div>
      ) : null}
      {left}
      <div className="min-w-0 flex-1">{children}</div>
      {right}
    </header>
  );
}
