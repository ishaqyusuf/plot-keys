import type { ReactNode } from "react";

type PortalPageProps = {
  children: ReactNode;
  description: string;
  eyebrow: string;
  title: string;
};

type PortalCardProps = {
  children: ReactNode;
  title: string;
};

export function PortalPage({
  children,
  description,
  eyebrow,
  title,
}: PortalPageProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[color:var(--pk-muted-foreground,#64748b)]">
          {eyebrow}
        </p>
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[color:var(--pk-foreground,#0f172a)] md:text-4xl">
            {title}
          </h1>
          <p className="max-w-3xl text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            {description}
          </p>
        </div>
      </div>

      {children}
    </section>
  );
}

export function PortalCard({ children, title }: PortalCardProps) {
  return (
    <section className="rounded-[1.5rem] border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)]/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.08)] backdrop-blur">
      <h2 className="text-lg font-semibold text-[color:var(--pk-foreground,#0f172a)]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
