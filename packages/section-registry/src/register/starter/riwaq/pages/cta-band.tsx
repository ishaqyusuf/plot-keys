"use client";

import { cn } from "@plotkeys/utils";
import { ChevronRight } from "lucide-react";
import { EditableText } from "../../../../sections/editing-primitives";
import { useRiwaqPage } from "../hooks/use-riwaq-page";
import { RiwaqTemplateAnchor } from "../ui/template-anchor";

export function RiwaqCtaBand() {
  const ctx = useRiwaqPage();

  return (
    <section className={cn(ctx.ui.preset.spacing.containerX, "pb-16 md:pb-20")}>
      <div
        className={ctx.ui.surface({
          className:
            "mx-auto grid max-w-4xl gap-5 p-5 md:grid-cols-[1fr_auto] md:items-center md:p-6",
        })}
      >
        <div>
          <EditableText
            as="h2"
            className="block text-2xl font-semibold leading-tight [font-family:var(--pk-font-heading)] md:text-3xl"
            contentKey="cta.heading"
            display="block"
            onCommit={ctx.commitContent}
            value={ctx.content(
              "cta.heading",
              "Ready to discuss the next project?",
            )}
          />
          <EditableText
            as="p"
            className="mt-3 block text-sm leading-6 text-[color:var(--pk-muted-foreground,#64748b)]"
            contentKey="cta.subheading"
            display="block"
            onCommit={ctx.commitContent}
            value={ctx.content(
              "cta.subheading",
              "Share your goals and let the team respond with the right property, project, or partnership path.",
            )}
          />
        </div>
        <RiwaqTemplateAnchor
          className={ctx.ui.button({
            className: "shrink-0",
            intent: "primary",
            size: "lg",
          })}
          page="contact"
        >
          <EditableText
            contentKey="cta.ctaLabel"
            onCommit={ctx.commitContent}
            value={ctx.content("cta.ctaLabel", "Contact us")}
          />
          <ChevronRight className="size-4" />
        </RiwaqTemplateAnchor>
      </div>
    </section>
  );
}
