"use client";

import { useRiwaqPage } from "../hooks/use-riwaq-page";
import { RiwaqTemplateAnchor } from "../ui/template-anchor";

export function RiwaqLandingPage() {
  const ctx = useRiwaqPage();
  const companyName = ctx.tenant?.companyName ?? "Riwaq";

  return (
    <main data-page-key={ctx.page.pageKey ?? "home"}>
      <section className="px-4 py-24 md:px-6">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-primary,#2563eb)]">
            {companyName}
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--pk-foreground,#0f172a)] md:text-6xl">
            Launch with proof, history, and a clear path to contact.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            Riwaq is a starter template for real-estate teams that want visitors
            to see delivery momentum before they make an enquiry.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <RiwaqTemplateAnchor
              className="rounded-lg bg-[color:var(--pk-primary,#2563eb)] px-5 py-3 text-sm font-medium text-white"
              page="roadmap"
            >
              View roadmap
            </RiwaqTemplateAnchor>
            <RiwaqTemplateAnchor
              className="rounded-lg border border-[color:var(--pk-border,#e2e8f0)] px-5 py-3 text-sm font-medium text-[color:var(--pk-foreground,#0f172a)]"
              page="contact"
            >
              Contact
            </RiwaqTemplateAnchor>
          </div>
        </div>
      </section>
    </main>
  );
}
