import { Field, FieldGroup } from "@plotkeys/ui/field";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type ControlItemInput = {
  children: ReactNode;
};

export function BuilderSidebarControlStack({ children }: Props) {
  return <FieldGroup className="flex flex-col gap-2">{children}</FieldGroup>;
}

export function BuilderSidebarControlItem({ children }: ControlItemInput) {
  return <Field>{children}</Field>;
}
