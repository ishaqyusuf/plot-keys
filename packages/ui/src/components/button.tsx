import { cn } from "@plotkeys/utils/cn";
import {
  type ComponentPropsWithoutRef,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "inverse";

type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  asChild?: boolean;
  children: ReactNode;
  variant?: ButtonVariant;
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-[0_18px_36px_rgba(15,118,110,0.24)] hover:brightness-95",
  secondary:
    "border border-[color:var(--border)] bg-white/90 text-[color:var(--foreground)] hover:bg-white",
  ghost: "bg-transparent text-[color:var(--foreground)] hover:bg-black/5",
  inverse:
    "bg-[color:var(--surface-inverse)] text-white shadow-[0_18px_36px_rgba(16,32,51,0.22)] hover:bg-slate-900",
};

export function Button({
  asChild = false,
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--ring)] disabled:cursor-not-allowed disabled:opacity-60",
    variantStyles[variant],
    className,
  );

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<{ className?: string }>;

    return cloneElement(child, {
      className: cn(classes, child.props.className),
    });
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
