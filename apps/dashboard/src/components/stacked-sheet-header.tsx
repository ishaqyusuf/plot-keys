"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { SheetHeader } from "@plotkeys/ui/sheet";

type Props = {
  closeLabel?: string;
  description?: string;
  onClose: () => void;
  title: string;
};

export function StackedSheetHeader({
  closeLabel = "Close sheet",
  description,
  onClose,
  title,
}: Props) {
  return (
    <SheetHeader className="mb-6 flex justify-between items-center flex-row">
      <div className="min-w-0">
        <h2 className="text-xl">{title}</h2>
        {description ? (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>

      <Button
        aria-label={closeLabel}
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="p-0 m-0 size-auto hover:bg-transparent"
        type="button"
      >
        <Icon.Close className="size-5" />
      </Button>
    </SheetHeader>
  );
}
