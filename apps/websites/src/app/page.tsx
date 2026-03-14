import type { HomeSectionDefinition } from "@plotkeys/section-registry";
import { sampleHomePage, sampleTheme } from "@plotkeys/section-registry";
import { Badge } from "@plotkeys/ui/badge";
import type { JSX } from "react";

function renderSection(section: HomeSectionDefinition) {
  const SectionComponent = section.component as (props: {
    config: HomeSectionDefinition["config"];
    theme: typeof sampleTheme;
  }) => JSX.Element;

  return (
    <SectionComponent
      key={section.id}
      config={section.config}
      theme={sampleTheme}
    />
  );
}

export default function TenantWebsiteHomePage() {
  return (
    <main className="min-h-screen px-4 py-5 md:px-6 md:py-6">
      <div className="mx-auto max-w-[82rem] overflow-hidden rounded-[2rem] border border-[color:var(--border)] bg-white/75 shadow-[var(--shadow-soft)] backdrop-blur">
        <div className="flex flex-col gap-3 border-b border-[color:var(--border)] bg-white/65 px-6 py-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
              Tenant website preview
            </p>
            <p className="mt-1">
              First MVP template for public company websites built from
              structured sections.
            </p>
          </div>
          <Badge variant="primary">Template 01</Badge>
        </div>
        {sampleHomePage.sections.map((section) => renderSection(section))}
      </div>
    </main>
  );
}
