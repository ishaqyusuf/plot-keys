import type { ReactNode } from "react";

type Props = {
  actions?: ReactNode;
  children: ReactNode;
  description: string;
  title: string;
};

export function EstateSection({
  actions,
  children,
  description,
  title,
}: Props) {
  return (
    <section className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-sm font-medium text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {actions ? (
          <div className="flex flex-wrap items-center gap-2">{actions}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}
