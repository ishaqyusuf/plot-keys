import { cn } from "@plotkeys/ui/cn";
import type { ReactNode } from "react";

export function FormBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("flex-1 px-6 py-5", className)}>{children}</div>;
}

export function FormFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-auto flex flex-col gap-2 border-t border-border bg-background px-6 py-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
