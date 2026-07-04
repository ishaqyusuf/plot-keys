"use client";

import { useRiwaqPage } from "../hooks/use-riwaq-page";

export function RiwaqContactPage() {
  const ctx = useRiwaqPage();
  const companyName = ctx.tenant?.companyName ?? "the team";

  return (
    <main data-page-key={ctx.page.pageKey ?? "contact"}>
      <section className="px-4 py-20 md:px-6">
        <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-primary,#2563eb)]">
              Contact
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[color:var(--pk-foreground,#0f172a)] md:text-5xl">
              Start a conversation with {companyName}.
            </h1>
            <p className="mt-5 text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
              Ask about a current opportunity, a past project, or the next step
              in your property search.
            </p>
          </div>
          <div className="rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] p-6">
            <label className="block text-sm font-medium" htmlFor="riwaq-email">
              Email
            </label>
            <input
              className="mt-2 h-11 w-full rounded-lg border border-[color:var(--pk-border,#e2e8f0)] bg-transparent px-3 text-sm"
              id="riwaq-email"
              name="email"
              placeholder="you@example.com"
              type="email"
            />
            <label
              className="mt-5 block text-sm font-medium"
              htmlFor="riwaq-message"
            >
              Message
            </label>
            <textarea
              className="mt-2 min-h-32 w-full rounded-lg border border-[color:var(--pk-border,#e2e8f0)] bg-transparent px-3 py-3 text-sm"
              id="riwaq-message"
              name="message"
              placeholder="Tell us what you need."
            />
          </div>
        </div>
      </section>
    </main>
  );
}
