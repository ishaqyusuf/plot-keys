"use client";

import { useRiwaqPage } from "../hooks/use-riwaq-page";

export function RiwaqBlogPage() {
  const ctx = useRiwaqPage();

  return (
    <main data-page-key={ctx.page.pageKey ?? "blog"}>
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-primary,#2563eb)]">
            Blog
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--pk-foreground,#0f172a)] md:text-5xl">
            Notes from the market and project floor.
          </h1>
          <p className="mt-5 text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            Publish project updates, customer guidance, and market commentary in
            one focused editorial stream.
          </p>
        </div>
      </section>
    </main>
  );
}
