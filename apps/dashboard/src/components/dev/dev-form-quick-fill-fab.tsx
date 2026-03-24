"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevFormQuickFillFab must not be imported in production.");
}

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { DevFabShell } from "./dev-fab-shell";

type FormEntry = {
  fieldCount: number;
  id: string;
  label: string;
};

const FIELD_SELECTOR = "input, select, textarea";

function isVisible(element: Element) {
  return element.getClientRects().length > 0;
}

function getFillableFields(form: HTMLFormElement) {
  return Array.from(form.querySelectorAll<HTMLElement>(FIELD_SELECTOR)).filter(
    (field) => {
      if (!isVisible(field)) {
        return false;
      }

      if (
        !(
          field instanceof HTMLInputElement ||
          field instanceof HTMLSelectElement ||
          field instanceof HTMLTextAreaElement
        )
      ) {
        return false;
      }

      if (field.disabled) {
        return false;
      }

      if (field instanceof HTMLInputElement) {
        return ![
          "button",
          "file",
          "hidden",
          "image",
          "reset",
          "submit",
        ].includes(field.type);
      }

      return true;
    },
  );
}

function inferFormLabel(form: HTMLFormElement, index: number) {
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

function setNativeValue(
  element: HTMLInputElement | HTMLTextAreaElement,
  value: string,
) {
  const prototype =
    element instanceof HTMLTextAreaElement
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype;
  const descriptor = Object.getOwnPropertyDescriptor(prototype, "value");
  descriptor?.set?.call(element, value);
}

function dispatchInputEvents(element: HTMLElement) {
  element.dispatchEvent(new Event("input", { bubbles: true }));
  element.dispatchEvent(new Event("change", { bubbles: true }));
}

function randomId() {
  return Math.random().toString(36).slice(2, 7);
}

function inferValue(
  field: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
  suffix: string,
) {
  const hint = [
    field.getAttribute("name"),
    field.getAttribute("id"),
    field.getAttribute("placeholder"),
    field.getAttribute("aria-label"),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (field instanceof HTMLTextAreaElement) {
    if (hint.includes("bio")) {
      return "Trusted real-estate professional serving Lagos families and investors.";
    }
    if (hint.includes("note")) {
      return "Prepared via dev quick fill for faster testing.";
    }
    return "Sample content generated for local testing.";
  }

  if (field instanceof HTMLSelectElement) {
    const preferred = Array.from(field.options).find(
      (option) => option.value && !option.disabled,
    );
    return preferred?.value ?? "";
  }

  if (field.type === "checkbox") {
    return "true";
  }

  if (field.type === "radio") {
    return "radio";
  }

  if (field.type === "email" || hint.includes("email")) {
    return `dev-${suffix}@plotkeys.test`;
  }

  if (field.type === "password" || hint.includes("password")) {
    return "lorem-ipsum";
  }

  if (
    field.type === "tel" ||
    hint.includes("phone") ||
    hint.includes("whatsapp")
  ) {
    return "+2348012345678";
  }

  if (
    field.type === "url" ||
    hint.includes("url") ||
    hint.includes("website")
  ) {
    return "https://example.com";
  }

  if (field.type === "date") {
    return "2026-03-24";
  }

  if (field.type === "datetime-local") {
    return "2026-03-24T09:00";
  }

  if (field.type === "time") {
    return "09:00";
  }

  if (field.type === "number") {
    if (hint.includes("bed")) return "4";
    if (hint.includes("bath")) return "3";
    if (hint.includes("order")) return "1";
    if (
      hint.includes("price") ||
      hint.includes("budget") ||
      hint.includes("rate")
    ) {
      return "500000";
    }
    return "1";
  }

  if (hint.includes("subdomain") || hint.includes("slug")) {
    return `dev-${suffix}`;
  }
  if (hint.includes("company")) {
    return "Aster Grove Realty";
  }
  if (
    hint.includes("full name") ||
    hint.includes("fullname") ||
    hint.includes("name")
  ) {
    return "Amara Okafor";
  }
  if (hint.includes("title")) {
    return "Sample Listing";
  }
  if (
    hint.includes("location") ||
    hint.includes("address") ||
    hint.includes("city")
  ) {
    return "Lekki, Lagos";
  }
  if (hint.includes("role")) {
    return "Sales Executive";
  }
  if (hint.includes("tagline")) {
    return "Real estate, made effortless.";
  }
  if (hint.includes("description")) {
    return "A well-finished sample entry prepared for local testing.";
  }

  return "Sample value";
}

export function fillForm(form: HTMLFormElement) {
  const fields = getFillableFields(form);
  const suffix = randomId();
  const chosenRadios = new Set<string>();

  for (const field of fields) {
    if (field instanceof HTMLInputElement) {
      if (field.type === "checkbox") {
        field.checked = true;
        dispatchInputEvents(field);
        continue;
      }

      if (field.type === "radio") {
        const key = field.name || field.id;
        if (!key || chosenRadios.has(key)) {
          continue;
        }
        field.checked = true;
        chosenRadios.add(key);
        dispatchInputEvents(field);
        continue;
      }

      setNativeValue(field, inferValue(field, suffix));
      dispatchInputEvents(field);
      continue;
    }

    if (field instanceof HTMLTextAreaElement) {
      setNativeValue(field, inferValue(field, suffix));
      dispatchInputEvents(field);
      continue;
    }

    field.value = inferValue(field, suffix);
    dispatchInputEvents(field);
  }
}

export function DevFormQuickFillFab() {
  const pathname = usePathname();
  const [forms, setForms] = useState<FormEntry[]>([]);
  const formMapRef = useRef<Map<string, HTMLFormElement>>(new Map());

  useEffect(() => {
    const update = () => {
      const scannedForms = Array.from(document.querySelectorAll("form"))
        .map((form, index) => ({
          element: form,
          fieldCount: getFillableFields(form).length,
          id: form.dataset.devQuickFillId ?? `dev-form-${index}`,
          label: inferFormLabel(form, index),
        }))
        .filter((form) => form.fieldCount > 0);

      formMapRef.current = new Map(
        scannedForms.map((form) => [form.id, form.element]),
      );

      setForms(
        scannedForms.map(({ fieldCount, id, label }) => ({
          fieldCount,
          id,
          label,
        })),
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

  if (forms.length === 0) {
    return null;
  }

  return (
    <DevFabShell label="Quick fill" containerClassName="bottom-20">
      <div className="divide-y divide-amber-100 dark:divide-amber-900/50">
        {forms.map((form) => (
          <button
            key={form.id}
            type="button"
            onClick={() => {
              const target = formMapRef.current.get(form.id);
              if (target) {
                fillForm(target);
              }
            }}
            className="w-full px-4 py-2.5 text-left transition hover:bg-amber-50 active:bg-amber-100 dark:hover:bg-amber-950/30"
          >
            <p className="font-mono text-xs font-semibold text-slate-800 dark:text-slate-100">
              {form.label}
            </p>
            <p className="font-mono text-[10px] text-amber-700 dark:text-amber-400">
              Fill {form.fieldCount} fields
            </p>
          </button>
        ))}
      </div>
    </DevFabShell>
  );
}
