import { Badge } from "@plotkeys/ui/badge";
import { Card } from "@plotkeys/ui/card";
import type { ReactNode } from "react";

type FlowShellProps = {
  badge: string;
  children: ReactNode;
  description: string;
  eyebrow?: string;
  sidePanel: ReactNode;
  title: string;
};

export function FlowShell({
  badge,
  children,
  description,
  eyebrow = "Tenant setup",
  sidePanel,
  title,
}: FlowShellProps) {
  return (
    <main className="min-h-screen px-6 py-12 md:px-8 md:py-16">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="bg-white/90">
          <div className="p-8 md:p-10">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              {eyebrow}
            </p>
            <Badge className="mt-5" variant="primary">
              {badge}
            </Badge>
            <h1 className="mt-5 max-w-3xl font-serif text-5xl text-slate-950 md:text-6xl">
              {title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              {description}
            </p>
            <div className="mt-8">{children}</div>
          </div>
        </Card>

        <Card className="bg-[linear-gradient(145deg,#102033_0%,#0f766e_100%)] text-white">
          <div className="p-8 md:p-10">{sidePanel}</div>
        </Card>
      </div>
    </main>
  );
}
