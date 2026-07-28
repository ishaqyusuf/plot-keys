import { cn } from "@plotkeys/ui/cn";
import Link from "next/link";
import type { ReactNode } from "react";

type HeaderLinkTabInput = {
  active: boolean;
  children: ReactNode;
  href: string;
};

type HeaderLinkTabListInput = {
  children: ReactNode;
  className?: string;
};

export const headerTabListClassName =
  "relative flex flex-wrap items-stretch bg-muted w-fit";

export const headerTabClassName =
  "group relative flex items-center gap-1.5 px-3 py-1.5 text-[14px] transition-all whitespace-nowrap border border-transparent h-[34px] min-h-[34px] mb-0 z-[1]";

export const inactiveHeaderTabClassName =
  "text-muted-foreground hover:text-foreground bg-muted";

export const activeHeaderTabClassName =
  "text-foreground bg-accent mb-[-1px] z-10";

export const activeHeaderTabStateClassName =
  "data-[state=active]:text-foreground data-[state=active]:bg-accent data-[state=active]:mb-[-1px] data-[state=active]:z-10";

export function HeaderLinkTabList({
  children,
  className,
}: HeaderLinkTabListInput) {
  return (
    <div className={cn(headerTabListClassName, className)}>{children}</div>
  );
}

export function HeaderLinkTab({ active, children, href }: HeaderLinkTabInput) {
  return (
    <Link
      className={cn(
        headerTabClassName,
        active ? activeHeaderTabClassName : inactiveHeaderTabClassName,
      )}
      href={href}
    >
      {children}
    </Link>
  );
}
