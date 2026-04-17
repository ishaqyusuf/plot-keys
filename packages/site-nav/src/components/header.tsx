"use client";

import { cn } from "@plotkeys/utils";
import type { ReactNode } from "react";

export type HeaderProps = {
  children?: ReactNode;
  className?: string;
  left?: ReactNode;
  right?: ReactNode;
};

export function Header({ children, className, left, right }: HeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-30 flex min-h-[78px] items-center gap-4 border-b border-border/70 bg-[color:color-mix(in_srgb,var(--color-background)_74%,white_26%)]/95 px-4 shadow-[0_1px_0_rgba(16,32,51,0.04)] backdrop-blur-xl sm:px-6 lg:px-8",
        className,
      )}
    >
      {left}
      <div className="min-w-0 flex-1">{children}</div>
      {right}
    </header>
  );
}
