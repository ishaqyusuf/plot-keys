"use client";

import type { ThemeConfig } from "../../../../sections/home-page";
import { EditableText } from "../../../../sections/editing-primitives";
import { useRiwaqPage } from "../hooks/use-riwaq-page";
import { joinClasses, riwaqSectionClassName } from "../ui/style";

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
  showIntro = true,
}: {
  config: RiwaqRoadmapTimelineConfig;
  showIntro?: boolean;
  theme: ThemeConfig;
}) {
  const ctx = useRiwaqPage();

  return (
    <section className={riwaqSectionClassName(ctx.ui.preset)}>
      <div
        className={joinClasses(
          "mx-auto grid",
          showIntro ? "max-w-6xl lg:grid-cols-[0.8fr_1.2fr]" : "max-w-4xl",
          ctx.ui.preset.spacing.sectionGap,
        )}
      >
        {showIntro ? (
          <div>
            <p className="text-xs font-semibold uppercase text-[color:var(--pk-primary,#2563eb)]">
              <EditableText
                contentKey="roadmap.eyebrow"
                onCommit={ctx.commitContent}
                value={config.eyebrow}
              />
            </p>
            <EditableText
              as="h2"
              className="mt-4 block max-w-xl text-3xl font-semibold [font-family:var(--pk-font-heading)] md:text-5xl"
              contentKey="roadmap.title"
              display="block"
              onCommit={ctx.commitContent}
              value={config.title}
            />
            <EditableText
              as="p"
              className="mt-5 block max-w-xl text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]"
              contentKey="roadmap.subtitle"
              display="block"
              onCommit={ctx.commitContent}
              value={config.description}
            />
          </div>
        ) : null}

        <ol className="relative space-y-5 before:absolute before:bottom-6 before:left-5 before:top-6 before:w-px before:bg-[color:var(--pk-border,#e2e8f0)]">
          {config.items.map((item, index) => {
            const itemPrefix = `roadmap.item${index + 1}`;

            return (
              <li
                className="relative grid grid-cols-[2.5rem_1fr] gap-4"
                key={item.year}
              >
                <div
                  className="relative z-10 flex size-10 items-center justify-center rounded-full border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] text-xs font-semibold"
                  style={{
                    color: "var(--pk-chart, var(--pk-primary,#2563eb))",
                  }}
                >
                  {item.year.slice(-2)}
                </div>
                <div className={ctx.ui.surface({ className: "p-5" })}>
                  <p className="text-xs font-semibold uppercase text-[color:var(--pk-muted-foreground,#64748b)]">
                    <EditableText
                      contentKey={`${itemPrefix}.year`}
                      onCommit={ctx.commitContent}
                      value={item.year}
                    />
                  </p>
                  <EditableText
                    as="h3"
                    className="mt-2 block text-lg font-semibold"
                    contentKey={`${itemPrefix}.title`}
                    display="block"
                    onCommit={ctx.commitContent}
                    value={item.title}
                  />
                  <EditableText
                    as="p"
                    className="mt-2 block text-sm leading-6 text-[color:var(--pk-muted-foreground,#64748b)]"
                    contentKey={`${itemPrefix}.body`}
                    display="block"
                    onCommit={ctx.commitContent}
                    value={item.body}
                  />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
