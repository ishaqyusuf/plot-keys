import { sampleHomePage, sampleTheme } from "@plotkeys/section-registry";

export default function TenantWebsiteHomePage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
        {sampleHomePage.sections.map((section) => {
          const SectionComponent = section.component;

          return (
            <SectionComponent
              key={section.id}
              config={section.config}
              theme={sampleTheme}
            />
          );
        })}
      </div>
    </main>
  );
}
