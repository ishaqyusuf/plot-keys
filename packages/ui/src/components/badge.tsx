import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

import { cn } from "../lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2 py-0.5 text-[0.72rem] font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default:
          "border-primary/10 bg-primary/12 text-primary [a&]:hover:bg-primary/16",
        secondary:
          "border-border/50 bg-secondary/55 text-foreground [a&]:hover:bg-secondary/70",
        destructive:
          "border-destructive/10 bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/12 dark:text-destructive dark:focus-visible:ring-destructive/40 [a&]:hover:bg-destructive/14",
        outline:
          "border-border/70 bg-background/72 text-foreground [a&]:hover:bg-accent/70 [a&]:hover:text-accent-foreground",
        ghost:
          "border-transparent bg-transparent [a&]:hover:bg-accent/70 [a&]:hover:text-accent-foreground",
        link: "text-primary underline-offset-4 [a&]:hover:underline",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span";

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
