"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { cn } from "@plotkeys/utils";

type HorizontalPaginationProps = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  className?: string;
};

export function HorizontalPagination({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  className,
}: HorizontalPaginationProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        className="size-6 p-0"
        disabled={!canScrollLeft}
        onClick={onScrollLeft}
        size="sm"
        variant="outline"
      >
        <Icon.ArrowBack
          className={cn("size-3.5", canScrollLeft && "text-primary")}
        />
      </Button>
      <Button
        className="size-6 p-0"
        disabled={!canScrollRight}
        onClick={onScrollRight}
        size="sm"
        variant="outline"
      >
        <Icon.ArrowForward
          className={cn("size-3.5", canScrollRight && "text-primary")}
        />
      </Button>
    </div>
  );
}
