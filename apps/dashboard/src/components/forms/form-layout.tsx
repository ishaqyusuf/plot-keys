import { cn } from "@plotkeys/utils";
import type { ReactNode } from "react";

export function DashboardFormBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 px-6 py-5", className)}>{children}</div>;
}

export function DashboardFormFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col gap-2 border-t border-border/60 bg-background/80 px-6 py-4 backdrop-blur",
        className,
      )}
    >
      {children}
    </div>
  );
}
