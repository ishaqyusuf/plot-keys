"use client";

/**
 * Inline editing primitives for the builder CMS layer.
 *
 * These components render their content normally in live/preview mode and
 * expose editing affordances (border highlight, overlay button) in draft mode.
 *
 * Usage in section components:
 *   <EditableText contentKey="hero.title" value={content["hero.title"]} />
 *   <EditableImage slot="heroImage" src={imageUrl} alt="Hero" />
 */

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { isContentKeyAiEnabled } from "../register/content-field-lookup";
import { useIsDraftMode } from "../runtime-context";

// ---------------------------------------------------------------------------
// EditableText
// ---------------------------------------------------------------------------

export type EditableTextProps = {
  /** Semantic HTML tag to render. Defaults to "span" for inline, "div" for block. */
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div";
  /** Optional AI override for callers that already know the content metadata. */
  aiEnabled?: boolean;
  /** Whether the current user can use AI actions for this field. */
  canUseAi?: boolean;
  /** Class names forwarded to the wrapper element. */
  className?: string;
  /** The content key this field maps to (e.g. "hero.title"). */
  contentKey: string;
  /** Render as block (div) or inline (span). Defaults to "inline". */
  display?: "block" | "inline";
  /** Called with the new value when the user commits an inline edit. */
  onCommit?: (contentKey: string, value: string) => Promise<void> | void;
  /** Inline styles forwarded to the rendered element. */
  style?: React.CSSProperties;
  /** The current field value. */
  value: string;
};

function focusEditableElement(element: HTMLElement | null) {
  if (!element) return;

  element.focus();

  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function buildAiSuggestions(
  contentKey: string,
  currentValue: string,
): string[] {
  const normalizedValue = currentValue.trim();
  const lowerKey = contentKey.toLowerCase();

  if (
    lowerKey.includes("description") ||
    lowerKey.includes("subtitle") ||
    lowerKey.includes("subheading") ||
    lowerKey.includes("body")
  ) {
    return [
      "Bring clarity, local expertise, and a smoother path to every property decision with a team clients can trust.",
      "Deliver a polished property experience backed by thoughtful advice, responsive service, and market knowledge that moves with confidence.",
      "Guide buyers, sellers, and investors with sharper insight, stronger communication, and a more refined path from first enquiry to final handover.",
    ];
  }

  if (
    lowerKey.includes("cta") ||
    lowerKey.includes("label") ||
    lowerKey.includes("button")
  ) {
    return [
      "Book a consultation",
      "Explore available listings",
      "Request a callback",
    ];
  }

  if (
    lowerKey.includes("title") ||
    lowerKey.includes("heading") ||
    lowerKey.includes("eyebrow")
  ) {
    return [
      "Find your next move with confidence",
      "Trusted property guidance for every step",
      "Spaces selected for the way you live",
    ];
  }

  if (normalizedValue) {
    return [
      normalizedValue,
      `${normalizedValue} — thoughtfully tailored for your next client conversation.`,
      `A refined take on ${normalizedValue.toLowerCase()}.`,
    ];
  }

  return [
    "Trusted local expertise",
    "Clear guidance for every move",
    "A polished property story starts here",
  ];
}

/**
 * Renders a text node in live mode. In draft mode, the element becomes
 * contentEditable with a visible amber outline and a "Save" button overlay.
 */
export function EditableText({
  as,
  aiEnabled,
  canUseAi = true,
  className,
  contentKey,
  display = "inline",
  onCommit,
  style,
  value,
}: EditableTextProps) {
  const isDraft = useIsDraftMode();
  const aiAvailable =
    canUseAi && (aiEnabled ?? isContentKeyAiEnabled(contentKey));
  const Tag = (as ?? (display === "block" ? "div" : "span")) as "div" | "span";
  const WrapperTag = display === "block" || Tag !== "span" ? "div" : "span";
  const [editing, setEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const [aiOpen, setAiOpen] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const aiSuggestions = useMemo(
    () => buildAiSuggestions(contentKey, localValue),
    [contentKey, localValue],
  );
  const activeSuggestion =
    aiSuggestions[suggestionIndex % Math.max(aiSuggestions.length, 1)] ??
    localValue;

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    if (!ref.current || ref.current.innerText === localValue) return;
    ref.current.innerText = localValue;
  }, [localValue]);

  if (!isDraft) {
    return (
      <Tag className={className} style={style}>
        {value}
      </Tag>
    );
  }

  function handleClick() {
    if (editing) return;
    setEditing(true);
    requestAnimationFrame(() => focusEditableElement(ref.current));
  }

  function handleInput(e: React.FormEvent<HTMLElement>) {
    setLocalValue((e.target as HTMLElement).innerText);
  }

  function handleDiscard() {
    setAiOpen(false);
    setEditing(false);
    setLocalValue(value);
  }

  function handleSave() {
    setAiOpen(false);
    setEditing(false);
    if (localValue !== value) {
      void onCommit?.(contentKey, localValue);
    }
  }

  function handleAiToggle(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setEditing(true);
    setAiOpen((current) => !current);
  }

  function handleTryAgain(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setSuggestionIndex((current) => current + 1);
  }

  function handleUseSuggestion(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    setEditing(true);
    setLocalValue(activeSuggestion);
    requestAnimationFrame(() => focusEditableElement(ref.current));
  }

  return (
    <WrapperTag
      className={
        display === "block"
          ? "group/editable relative block"
          : "group/editable relative inline-block max-w-full"
      }
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {aiAvailable && !editing && isHovered ? (
        <button
          aria-label={`Generate AI copy for ${contentKey}`}
          className="absolute -right-2 -top-2 z-20 rounded-full border border-amber-400/60 bg-background/95 px-2 py-1 text-[11px] font-semibold text-amber-700 shadow-sm backdrop-blur hover:border-amber-500 hover:text-amber-800"
          type="button"
          onClick={handleAiToggle}
          onMouseDown={(event) => event.stopPropagation()}
        >
          ✦ AI
        </button>
      ) : null}

      {editing ? (
        <div className="absolute left-0 top-full z-30 mt-2 flex flex-wrap items-center gap-2 rounded-md border border-border/70 bg-background/95 px-2 py-2 text-xs shadow-lg backdrop-blur">
          <button
            className="rounded-md border border-primary/20 bg-primary/10 px-2.5 py-1 font-medium text-primary hover:bg-primary/15"
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleSave}
          >
            ✓ Save
          </button>
          <button
            className="rounded-md border border-border/70 bg-background px-2.5 py-1 font-medium text-muted-foreground hover:text-foreground"
            type="button"
            onMouseDown={(event) => event.stopPropagation()}
            onClick={handleDiscard}
          >
            ✕ Discard
          </button>
          {aiAvailable ? (
            <button
              className="rounded-md border border-amber-400/40 bg-amber-50 px-2.5 py-1 font-medium text-amber-700 hover:bg-amber-100"
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleAiToggle}
            >
              ✦ AI
            </button>
          ) : null}
        </div>
      ) : null}

      {aiAvailable && aiOpen ? (
        <div className="absolute left-0 top-full z-30 mt-14 w-[min(28rem,90vw)] rounded-xl border border-border/70 bg-background/98 p-3 shadow-xl backdrop-blur">
          <div className="mb-2 flex items-center justify-between gap-3">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-amber-700">
              AI suggestion
            </p>
            <button
              aria-label="Close AI suggestion panel"
              className="rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setAiOpen(false);
              }}
            >
              ✕
            </button>
          </div>
          <div className="rounded-lg border border-border/70 bg-muted/30 p-3 text-sm leading-6 text-foreground">
            {activeSuggestion}
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              className="rounded-md border border-primary/20 bg-primary px-2.5 py-1.5 text-xs font-medium text-primary-foreground hover:opacity-95"
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleUseSuggestion}
            >
              Use this
            </button>
            <button
              className="rounded-md border border-border/70 bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground"
              type="button"
              onMouseDown={(event) => event.stopPropagation()}
              onClick={handleTryAgain}
            >
              Try again
            </button>
          </div>
        </div>
      ) : null}

      <Tag
        ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
        style={style}
        className={[
          className,
          "cursor-text outline-none transition-shadow",
          editing
            ? "rounded ring-2 ring-primary/60"
            : "rounded ring-1 ring-amber-400/60 hover:ring-amber-500/80",
        ]
          .filter(Boolean)
          .join(" ")}
        contentEditable={editing}
        suppressContentEditableWarning
        onClick={handleClick}
        onInput={handleInput}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            handleDiscard();
          }
        }}
      >
        {localValue}
      </Tag>
    </WrapperTag>
  );
}

// ---------------------------------------------------------------------------
// EditableImage
// ---------------------------------------------------------------------------

export type EditableImageProps = {
  /** Alt text for the image element. */
  alt: string;
  /** Class names forwarded to the wrapper div. */
  className?: string;
  /** Called with the new URL when the user submits a replacement image. */
  onReplace?: (slot: string, url: string) => void;
  /** Template named-image slot identifier (e.g. "heroImage"). */
  slot: string;
  /** Current image URL. Rendered directly in live mode. */
  src: string | undefined;
};

/**
 * Renders an image in live mode. In draft mode, adds a translucent overlay
 * with a "Replace" button that opens a URL input prompt.
 *
 * For a full upload experience, wire `onReplace` to the tenant asset upload
 * action and replace the prompt with a proper file picker modal.
 */
export function EditableImage({
  alt,
  className,
  onReplace,
  slot,
  src,
}: EditableImageProps) {
  const isDraft = useIsDraftMode();
  const [replacing, setReplacing] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const placeholderBg = "hsl(210 15% 88%)";

  function handleReplace() {
    setReplacing(true);
    setUrlInput(src ?? "");
  }

  function handleConfirm() {
    if (urlInput.trim()) {
      onReplace?.(slot, urlInput.trim());
    }
    setReplacing(false);
  }

  return (
    <div className={["relative", className].filter(Boolean).join(" ")}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt} className="h-full w-full object-cover" src={src} />
      ) : (
        <div
          className="h-full w-full"
          style={{ backgroundColor: placeholderBg }}
          aria-label={`${slot} placeholder`}
        />
      )}

      {isDraft && (
        <div className="pointer-events-none absolute inset-0 ring-2 ring-inset ring-amber-400/60">
          {!replacing ? (
            <button
              className="pointer-events-auto absolute right-2 top-2 rounded-md border border-border/60 bg-background/90 px-2 py-1 text-xs font-medium text-foreground shadow backdrop-blur hover:bg-background"
              type="button"
              onClick={handleReplace}
            >
              Replace image
            </button>
          ) : (
            <div className="pointer-events-auto absolute inset-x-2 top-2 flex gap-1.5">
              <input
                autoFocus
                className="flex-1 rounded border border-border px-2 py-1 text-xs"
                placeholder="Paste image URL…"
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleConfirm()}
              />
              <button
                className="rounded border border-border/60 bg-background/90 px-2 py-1 text-xs font-medium"
                type="button"
                onClick={handleConfirm}
              >
                Set
              </button>
              <button
                className="rounded border border-border/60 bg-background/90 px-2 py-1 text-xs text-muted-foreground"
                type="button"
                onClick={() => setReplacing(false)}
              >
                ✕
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// EditableRepeater — generic editable list (placeholder for V2)
// ---------------------------------------------------------------------------

export type EditableRepeaterProps<T> = {
  children: (item: T, index: number) => ReactNode;
  items: T[];
  onReorder?: (items: T[]) => void;
};

/**
 * Renders a list of items and, in draft mode, shows drag handles for
 * reordering. Reordering logic is a no-op until the DnD library is wired.
 */
export function EditableRepeater<T>({
  children,
  items,
}: EditableRepeaterProps<T>) {
  const isDraft = useIsDraftMode();

  return (
    <div className={isDraft ? "group/repeater relative" : undefined}>
      {items.map((item, i) => (
        <div key={i} className={isDraft ? "group/item relative" : undefined}>
          {isDraft && (
            <div className="pointer-events-none absolute left-0 top-1/2 z-10 -translate-x-6 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
              <span
                className="cursor-grab select-none text-muted-foreground/60"
                aria-hidden
              >
                ⠿
              </span>
            </div>
          )}
          {children(item, i)}
        </div>
      ))}
    </div>
  );
}
