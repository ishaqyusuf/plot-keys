"use client";

import { EditableText } from "../../../../sections/editing-primitives";
import { useRiwaqPage } from "../hooks/use-riwaq-page";
import { riwaqSectionClassName } from "../ui/style";
import { RiwaqRoadmapTimelineSection } from "../sections/roadmap-timeline";
import { RiwaqCtaBand } from "./cta-band";

export function RiwaqRoadmapPage() {
  const ctx = useRiwaqPage();
  const showHeader = ctx.sectionVisible("hero_banner");
  const showRoadmap = ctx.sectionVisible("riwaq_roadmap_timeline");
  const showCta = ctx.sectionVisible("cta_band");
  const roadmapItems = [
    {
      body: ctx.content(
        "roadmap.item1.body",
        "Started with a small portfolio and a commitment to transparent buyer and renter communication.",
      ),
      title: ctx.content("roadmap.item1.title", "First managed portfolio"),
      year: ctx.content("roadmap.item1.year", "2016"),
    },
    {
      body: ctx.content(
        "roadmap.item2.body",
        "Expanded into new communities and documented each milestone for customers and partners.",
      ),
      title: ctx.content("roadmap.item2.title", "Neighborhood expansion"),
      year: ctx.content("roadmap.item2.year", "2019"),
    },
    {
      body: ctx.content(
        "roadmap.item3.body",
        "Moved project history, updates, and enquiry paths into one public tenant website.",
      ),
      title: ctx.content("roadmap.item3.title", "Digital trust layer"),
      year: ctx.content("roadmap.item3.year", "2024"),
    },
  ];

  return (
    <main
      className="bg-[color:var(--pk-background,#ffffff)] text-[color:var(--pk-foreground,#0f172a)]"
      data-page-key={ctx.page.pageKey ?? "roadmap"}
    >
      {showHeader ? (
        <section className={riwaqSectionClassName(ctx.ui.preset)}>
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-semibold uppercase text-[color:var(--pk-primary,#2563eb)]">
              <EditableText
                contentKey="roadmap.eyebrow"
                onCommit={ctx.commitContent}
                value={ctx.content("roadmap.eyebrow", "Roadmap")}
              />
            </p>
            <EditableText
              as="h1"
              className="mt-4 block text-4xl font-semibold text-[color:var(--pk-foreground,#0f172a)] [font-family:var(--pk-font-heading)] md:text-5xl"
              contentKey="roadmap.title"
              display="block"
              onCommit={ctx.commitContent}
              value={ctx.content(
                "roadmap.title",
                "Project history visitors can scan.",
              )}
            />
            <EditableText
              as="p"
              className="mt-5 block text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]"
              contentKey="roadmap.subtitle"
              display="block"
              onCommit={ctx.commitContent}
              value={ctx.content(
                "roadmap.subtitle",
                "Use the roadmap to show what the company has launched, improved, handed over, or planned across time.",
              )}
            />
          </div>
        </section>
      ) : null}
      {showRoadmap ? (
        <RiwaqRoadmapTimelineSection
          config={{
            description: ctx.content(
              "roadmap.subtitle",
              "Use the roadmap to show what the company has launched, improved, handed over, or planned across time.",
            ),
            eyebrow: ctx.content("roadmap.eyebrow", "Project history"),
            items: roadmapItems,
            title: ctx.content("roadmap.title", "A visible record of delivery."),
          }}
          showIntro={false}
          theme={ctx.theme}
        />
      ) : null}
      {showCta ? <RiwaqCtaBand /> : null}
    </main>
  );
}
