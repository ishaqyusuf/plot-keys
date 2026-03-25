"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevFormQuickFillFab must not be imported in production.");
}

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DevFabShell } from "./dev-fab-shell";
import { DEV_QUICK_FILL_SLOT_ID } from "./dev-quick-fill-portal";
import { type QuickFillProfile, runQuickFill } from "./quick-fill";

type FormEntry = {
  id: string;
  label: string;
  profile: QuickFillProfile;
};

const EXCLUDED_PATHS = new Set(["/sign-in"]);

function isVisible(element: Element) {
  return element.getClientRects().length > 0;
}

function inferFormLabel(form: HTMLFormElement, index: number) {
  const explicitLabel = form.dataset.devQuickFillLabel;
  if (explicitLabel) {
    return explicitLabel;
  }

  const ariaLabel = form.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel;
  }

  const heading = form
    .closest("section, article, dialog, div")
    ?.querySelector("h1, h2, h3, h4, legend");

  const headingText = heading?.textContent?.trim();
  if (headingText) {
    return headingText;
  }

  return index === 0 ? "Main form" : `Form ${index + 1}`;
}

export function DevFormQuickFillFab() {
  const pathname = usePathname();
  const [forms, setForms] = useState<FormEntry[]>([]);
  const [hasPortaledContent, setHasPortaledContent] = useState(false);
  const formMapRef = useRef<Map<string, HTMLFormElement>>(new Map());
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => {
      const scannedForms = Array.from(document.querySelectorAll("form"))
        .map((form, index) => ({
          element: form,
          id: form.dataset.devQuickFillId ?? `dev-form-${index}`,
          label: inferFormLabel(form, index),
          profile:
            (form.dataset.devQuickFillProfile as
              | QuickFillProfile
              | undefined) ?? "generic",
        }))
        .filter((form) => isVisible(form.element));

      formMapRef.current = new Map(
        scannedForms.map((form) => [form.id, form.element]),
      );

      setForms(
        scannedForms.map(({ id, label, profile }) => ({ id, label, profile })),
      );
    };

    update();

    const observer = new MutationObserver(() => update());
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const slot = slotRef.current;

    if (!slot) {
      return;
    }

    const update = () => {
      setHasPortaledContent(slot.childElementCount > 0);
    };

    update();

    const observer = new MutationObserver(update);
    observer.observe(slot, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  if (EXCLUDED_PATHS.has(pathname)) {
    return null;
  }

  if (forms.length === 0 && !hasPortaledContent) {
    return null;
  }

  return (
    <DevFabShell label="Quick fill" containerClassName="bottom-20">
      <div
        id={DEV_QUICK_FILL_SLOT_ID}
        ref={slotRef}
        className={hasPortaledContent ? "p-3" : "hidden"}
      />

      {!hasPortaledContent && (
        <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
          {forms.map((form) => (
            <button
              key={form.id}
              type="button"
              onClick={() => {
                const target = formMapRef.current.get(form.id);
                if (target) {
                  void runQuickFill(target, form.profile);
                }
              }}
              className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
            >
              <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
                {form.label}
              </p>
              <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
                One click fill
              </p>
            </button>
          ))}
        </div>
      )}
    </DevFabShell>
  );
}
