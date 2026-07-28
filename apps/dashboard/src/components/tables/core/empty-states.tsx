"use client";

import { Button } from "@plotkeys/ui/button";
import type { ReactNode } from "react";

interface EmptyStateProps {
  title: string;
  description: ReactNode;
  action?: ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  action,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center mt-40">
        <div className="text-center mb-6 space-y-2">
          <h2 className="font-medium text-lg">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        {action ??
          (actionLabel && onAction ? (
            <Button variant="outline" onClick={onAction}>
              {actionLabel}
            </Button>
          ) : null)}
      </div>
    </div>
  );
}

interface NoResultsProps {
  onClear: () => void;
}

export function NoResults({ onClear }: NoResultsProps) {
  return (
    <EmptyState
      title="No results"
      description="Try another search, or adjusting the filters"
      actionLabel="Clear filters"
      onAction={onClear}
    />
  );
}
