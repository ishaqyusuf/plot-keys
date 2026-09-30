import type { ReactNode } from "react";

export function FlowDevTools({ children }: { children: ReactNode }) {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <details className="flow-dev-tools">
      <summary>Development QA tools</summary>
      <div>{children}</div>
    </details>
  );
}
