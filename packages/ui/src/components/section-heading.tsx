import { cn } from "@plotkeys/utils/cn";
import type { ComponentPropsWithoutRef, ReactNode } from "react";

type SectionHeadingProps = ComponentPropsWithoutRef<"div"> & {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
};

export function SectionHeading({
  align = "left",
  className,
  description,
  eyebrow,
  title,
  ...props
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "mx-auto max-w-3xl text-center",
        className,
      )}
      {...props}
    >
      {eyebrow ? (
        <p className="text-sm uppercase tracking-[0.32em] text-[color:var(--muted)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="font-serif text-4xl text-[color:var(--foreground)] md:text-5xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base leading-8 text-[color:var(--muted-foreground)] md:text-lg">
          {description}
        </p>
      ) : null}
    </div>
  );
}
