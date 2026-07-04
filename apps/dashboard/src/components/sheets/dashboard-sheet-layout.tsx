import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@plotkeys/ui/sheet";
import { cn } from "@plotkeys/utils";
import type { ReactNode } from "react";

export function DashboardSheetHeader({
  className,
  description,
  title,
}: {
  className?: string;
  description?: ReactNode;
  title: ReactNode;
}) {
  return (
    <SheetHeader
      className={cn("border-b border-border/60 px-6 py-5", className)}
    >
      <SheetTitle className="text-xl tracking-[-0.03em]">{title}</SheetTitle>
      {description ? (
        <SheetDescription className="max-w-xl leading-6">
          {description}
        </SheetDescription>
      ) : null}
    </SheetHeader>
  );
}
