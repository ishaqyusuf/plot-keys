"use client";

import { Button } from "@plotkeys/ui/button";
import { cn } from "@plotkeys/ui/cn";
import { Icon } from "@plotkeys/ui/icons";
import { type ComponentProps, forwardRef, type ReactNode } from "react";

function PickerChevronIcon() {
  return (
    <Icon.ChevronRight
      aria-hidden="true"
      className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-muted-foreground"
    />
  );
}

export const BuilderSidebarPickerButton = forwardRef<
  HTMLButtonElement,
  ComponentProps<typeof Button> & {
    children: ReactNode;
    label: string;
  }
>(function BuilderSidebarPickerButton(
  { children, className, label, type = "button", ...props },
  ref,
) {
  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-auto w-full justify-start px-2.5 py-1.5 text-left",
        className,
      )}
      ref={ref}
      type={type}
      {...props}
    >
      <span className="flex flex-col items-start pr-7">
        <span className="text-xs font-normal text-muted-foreground">
          {label}
        </span>
        <span className="mt-0.5 text-sm font-medium text-foreground">
          {children}
        </span>
      </span>
      <PickerChevronIcon />
    </Button>
  );
});
