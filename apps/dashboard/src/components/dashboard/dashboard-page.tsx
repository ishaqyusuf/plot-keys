"use client";

import { cn } from "@plotkeys/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export function DashboardPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "min-h-[calc(100svh-4rem)] px-4 py-5 sm:px-6 sm:py-6 lg:px-8",
        className,
      )}
    >
      <div className="mx-auto flex w-full max-w-[var(--content-width)] flex-col gap-5">
        {children}
      </div>
    </main>
  );
}

export function DashboardPageHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 rounded-[1.35rem] border border-border/65 bg-card/72 px-5 py-4 shadow-[var(--shadow-soft)] backdrop-blur md:px-6 md:py-5",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function DashboardPageHeaderRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardPageIntro({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("min-w-0 space-y-1.5", className)}>{children}</div>;
}

export function DashboardPageEyebrow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground/78",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function DashboardPageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h1
      className={cn(
        "text-[1.72rem] leading-none font-semibold tracking-[-0.05em] text-foreground sm:text-[1.88rem]",
        className,
      )}
    >
      {children}
    </h1>
  );
}

export function DashboardPageDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "max-w-3xl text-[0.93rem] leading-6 text-muted-foreground",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function DashboardPageActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 lg:justify-end",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardPageToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 border-t border-border/60 pt-4 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardToolbarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  );
}

export function DashboardFilterTabs({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex flex-wrap items-center gap-1.5 rounded-full border border-border/60 bg-card/70 p-1",

        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardFilterTab({
  active,
  children,
  className,
  href,
}: {
  active?: boolean;
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "rounded-full px-3 py-1.5 text-[0.72rem] font-medium transition-colors",
        active
          ? "bg-foreground/[0.06] text-foreground"
          : "text-muted-foreground hover:bg-background/68 hover:text-foreground",
        className,
      )}
    >
      {children}
    </Link>
  );
}

export function DashboardTablePage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[1.25rem] border border-border/65 bg-card/76 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      {children}
    </section>
  );
}

export function DashboardTablePageHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-b border-border/55 px-5 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardTableHeaderTop({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardTableFilters({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pt-1 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardTablePageTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-[0.98rem] font-semibold tracking-[-0.03em] text-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function DashboardTablePageDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}

export function DashboardTableToolbar({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardTableToolbarGroup({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {children}
    </div>
  );
}

export function DashboardTablePageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("px-0 pb-1 pt-0", className)}>{children}</div>;
}

export function DashboardStatGrid({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid gap-3 sm:grid-cols-2 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export function DashboardStatCard({
  href,
  icon: Icon,
  label,
  value,
  meta,
}: {
  href?: string;
  icon: LucideIcon;
  label: string;
  value: ReactNode;
  meta?: ReactNode;
}) {
  const content = (
    <div className="rounded-[1.25rem] border border-border/65 bg-card/78 p-4 shadow-[var(--shadow-soft)] transition-colors hover:bg-card/88">
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-10 items-center justify-center rounded-[1rem] bg-foreground/[0.042] text-foreground">
          <Icon className="size-4" />
        </div>
        {meta ? (
          <div className="text-right text-[0.72rem] text-muted-foreground">
            {meta}
          </div>
        ) : null}
      </div>
      <div className="mt-5 space-y-1">
        <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground/85">
          {label}
        </p>
        <p className="text-[1.58rem] font-semibold leading-none tracking-[-0.05em] text-foreground">
          {value}
        </p>
      </div>
    </div>
  );

  if (!href) {
    return content;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export function DashboardSection({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <section className={cn("space-y-3.5", className)}>{children}</section>;
}

export function DashboardSectionHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function DashboardSectionTitle({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "text-lg font-semibold tracking-[-0.03em] text-foreground",
        className,
      )}
    >
      {children}
    </h2>
  );
}

export function DashboardSectionDescription({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>{children}</p>
  );
}

export function DashboardSurface({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[calc(var(--radius-xl)+0.125rem)] border border-border/70 bg-card/88 shadow-[var(--shadow-card)] backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
