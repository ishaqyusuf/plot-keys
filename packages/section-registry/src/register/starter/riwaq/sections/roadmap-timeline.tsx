import type { ThemeConfig } from "../../../../sections/home-page";

export type RiwaqRoadmapTimelineItem = {
  body: string;
  title: string;
  year: string;
};

export type RiwaqRoadmapTimelineConfig = {
  description: string;
  eyebrow: string;
  items: RiwaqRoadmapTimelineItem[];
  title: string;
};

export function RiwaqRoadmapTimelineSection({
  config,
}: {
  config: RiwaqRoadmapTimelineConfig;
  theme: ThemeConfig;
}) {
  return (
    <section className="bg-[color:var(--pk-background,#ffffff)] px-4 py-20 text-[color:var(--pk-foreground,#0f172a)] md:px-6">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-primary,#2563eb)]">
            {config.eyebrow}
          </p>
          <h2 className="mt-4 max-w-xl text-3xl font-semibold tracking-tight md:text-5xl">
            {config.title}
          </h2>
          <p className="mt-5 max-w-xl text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            {config.description}
          </p>
        </div>

        <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-[color:var(--pk-border,#e2e8f0)]">
          {config.items.map((item) => (
            <li className="relative grid grid-cols-[2.5rem_1fr] gap-4" key={item.year}>
              <div className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] text-xs font-semibold text-[color:var(--pk-primary,#2563eb)]">
                {item.year.slice(-2)}
              </div>
              <div className="rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--pk-muted-foreground,#64748b)]">
                  {item.year}
                </p>
                <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-[color:var(--pk-muted-foreground,#64748b)]">
                  {item.body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
