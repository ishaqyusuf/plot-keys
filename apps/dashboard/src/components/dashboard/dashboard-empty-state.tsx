import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@plotkeys/ui/empty";
import { cn } from "@plotkeys/utils";
import type { ReactNode } from "react";

export function DashboardEmptyState({
  actions,
  className,
  description,
  icon,
  title,
}: {
  actions?: ReactNode;
  className?: string;
  description: ReactNode;
  icon?: ReactNode;
  title: ReactNode;
}) {
  return (
    <Empty
      className={cn(
        "rounded-[calc(var(--radius-xl)+0.125rem)] border border-border/65 bg-card/76 shadow-[var(--shadow-soft)]",
        className,
      )}
    >
      <EmptyHeader>
        {icon ? <EmptyMedia variant="icon">{icon}</EmptyMedia> : null}
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {actions ? <EmptyContent>{actions}</EmptyContent> : null}
    </Empty>
  );
}
