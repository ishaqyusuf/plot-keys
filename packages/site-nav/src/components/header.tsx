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
        "md:m-0 z-50 px-6 md:border-b h-[70px] flex justify-between items-center top-0 backdrop-filter backdrop-blur-xl md:backdrop-filter md:backdrop-blur-none bg-background bg-opacity-70 desktop:rounded-t-[10px] transition-transform",
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
