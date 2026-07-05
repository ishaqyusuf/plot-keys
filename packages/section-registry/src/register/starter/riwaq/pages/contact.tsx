"use client";

import { useState } from "react";
import { EditableText } from "../../../../sections/editing-primitives";
import { useRiwaqPage } from "../hooks/use-riwaq-page";
import { joinClasses, riwaqSectionClassName } from "../ui/style";
import { RiwaqCtaBand } from "./cta-band";

export function RiwaqContactPage() {
  const ctx = useRiwaqPage();
  const companyName = ctx.tenant?.companyName ?? "the team";
  const showHeader = ctx.sectionVisible("hero_banner");
  const showContact = ctx.sectionVisible("contact_section");
  const showCta = ctx.sectionVisible("cta_band");
  const [formNotice, setFormNotice] = useState("");

  return (
    <main
      className="bg-[color:var(--pk-background,#ffffff)] text-[color:var(--pk-foreground,#0f172a)]"
      data-page-key={ctx.page.pageKey ?? "contact"}
    >
      {showHeader || showContact ? (
        <section className={riwaqSectionClassName(ctx.ui.preset)}>
          <div
            className={joinClasses(
              "mx-auto grid max-w-5xl md:grid-cols-[0.9fr_1.1fr]",
              ctx.ui.preset.spacing.sectionGap,
            )}
          >
            {showHeader ? (
              <div>
                <p className="text-xs font-semibold uppercase text-[color:var(--pk-primary,#2563eb)]">
                  <EditableText
                    contentKey="contact.eyebrow"
                    onCommit={ctx.commitContent}
                    value={ctx.content("contact.eyebrow", "Contact")}
                  />
                </p>
                <EditableText
                  as="h1"
                  className="mt-4 block text-4xl font-semibold text-[color:var(--pk-foreground,#0f172a)] [font-family:var(--pk-font-heading)] md:text-5xl"
                  contentKey="contact.title"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "contact.title",
                    `Start a conversation with ${companyName}.`,
                  )}
                />
                <EditableText
                  as="p"
                  className="mt-5 block text-base leading-7 text-[color:var(--pk-muted-foreground,#64748b)]"
                  contentKey="contact.subtitle"
                  display="block"
                  onCommit={ctx.commitContent}
                  value={ctx.content(
                    "contact.subtitle",
                    "Ask about a current opportunity, a past project, or the next step in your property search.",
                  )}
                />
              </div>
            ) : null}
            {showContact ? (
              <form
                className={ctx.ui.surface({ className: "p-6" })}
                onSubmit={(event) => {
                  event.preventDefault();
                  setFormNotice(
                    ctx.isDevMode
                      ? "Draft mode: form submission is disabled."
                      : "Thanks. The team will respond soon.",
                  );
                }}
              >
                <label
                  className="block text-sm font-medium"
                  htmlFor="riwaq-email"
                >
                  <EditableText
                    contentKey="contact.form.emailLabel"
                    onCommit={ctx.commitContent}
                    value={ctx.content("contact.form.emailLabel", "Email")}
                  />
                </label>
                <input
                  className={ctx.ui.input({ className: "mt-2", size: "lg" })}
                  id="riwaq-email"
                  name="email"
                  placeholder={ctx.content(
                    "contact.form.emailPlaceholder",
                    "you@example.com",
                  )}
                  type="email"
                />
                <label
                  className="mt-5 block text-sm font-medium"
                  htmlFor="riwaq-message"
                >
                  <EditableText
                    contentKey="contact.form.messageLabel"
                    onCommit={ctx.commitContent}
                    value={ctx.content("contact.form.messageLabel", "Message")}
                  />
                </label>
                <textarea
                  className={ctx.ui.input({
                    className: "mt-2 h-auto min-h-32 resize-none py-3",
                    size: "lg",
                  })}
                  id="riwaq-message"
                  name="message"
                  placeholder={ctx.content(
                    "contact.form.messagePlaceholder",
                    "Tell us what you need.",
                  )}
                />
                <button
                  className={ctx.ui.button({
                    className: "mt-5 w-full",
                    intent: "primary",
                    size: "lg",
                  })}
                  type="submit"
                >
                  <EditableText
                    contentKey="contact.form.submitLabel"
                    onCommit={ctx.commitContent}
                    value={ctx.content(
                      "contact.form.submitLabel",
                      "Send enquiry",
                    )}
                  />
                </button>
                {formNotice ? (
                  <p
                    aria-live="polite"
                    className="mt-3 text-sm text-[color:var(--pk-muted-foreground,#64748b)]"
                  >
                    {formNotice}
                  </p>
                ) : null}
              </form>
            ) : null}
          </div>
        </section>
      ) : null}
      {showCta ? <RiwaqCtaBand /> : null}
    </main>
  );
}
