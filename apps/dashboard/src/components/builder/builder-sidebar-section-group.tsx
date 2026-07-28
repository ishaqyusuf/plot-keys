import { FieldLabel } from "@plotkeys/ui/field";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title: string;
};

type SidebarFieldInput = {
  children: ReactNode;
  label: string;
  labelClassName?: string;
};

export function BuilderSidebarSectionGroup({ children, title }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      {children}
    </div>
  );
}

export function BuilderSidebarField({
  children,
  label,
  labelClassName,
}: SidebarFieldInput) {
  return (
    <div>
      <FieldLabel className={labelClassName ?? "text-xs text-muted-foreground"}>
        {label}
      </FieldLabel>
      {children}
    </div>
  );
}
