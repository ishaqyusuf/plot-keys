import { Alert, AlertDescription } from "@plotkeys/ui/alert";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  variant?: "default" | "destructive";
};

export function BlogDetailNotice({ children, variant = "default" }: Props) {
  return (
    <Alert variant={variant}>
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  );
}
