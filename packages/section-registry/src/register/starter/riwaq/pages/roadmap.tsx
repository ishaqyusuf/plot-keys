"use client";

import { useRiwaqPage } from "../hooks/use-riwaq-page";

export function RiwaqRoadmapPage() {
  const ctx = useRiwaqPage();

  return (
    <main data-page-key={ctx.page.pageKey ?? "roadmap"}>
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-primary,#2563eb)]">
            Roadmap
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--pk-foreground,#0f172a)] md:text-5xl">
            Project history visitors can scan.
          </h1>
          <ol className="mt-10 space-y-4">
            {["First portfolio", "Market expansion", "Digital trust layer"].map(
              (item, index) => (
                <li
                  className="rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] p-5"
                  key={item}
                >
                  <p className="text-xs font-semibold text-[color:var(--pk-primary,#2563eb)]">
                    0{index + 1}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold">{item}</h2>
                </li>
              ),
            )}
          </ol>
        </div>
      </section>
    </main>
  );
}
