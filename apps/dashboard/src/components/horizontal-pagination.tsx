"use client";

import { Button } from "@plotkeys/ui/button";
import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";

type Props = {
  canScrollLeft: boolean;
  canScrollRight: boolean;
  className?: string;
  onScrollLeft: () => void;
  onScrollRight: () => void;
};

export function HorizontalPagination({
  canScrollLeft,
  canScrollRight,
  onScrollLeft,
  onScrollRight,
  className,
}: Props) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant="outline"
        size="sm"
        disabled={!canScrollLeft}
        className="size-6 p-0"
        onClick={onScrollLeft}
      >
        <Icon.ArrowBack
          className={cn("size-3.5", canScrollLeft && "text-primary")}
        />
      </Button>
      <Button
        variant="outline"
        size="sm"
        disabled={!canScrollRight}
        className="size-6 p-0"
        onClick={onScrollRight}
      >
        <Icon.ArrowForward
          className={cn("size-3.5", canScrollRight && "text-primary")}
        />
      </Button>
    </div>
  );
}
