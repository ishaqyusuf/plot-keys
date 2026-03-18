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

import { type ReactNode, useRef, useState } from "react";
import { useIsDraftMode } from "../runtime-context";

// ---------------------------------------------------------------------------
// EditableText
// ---------------------------------------------------------------------------

export type EditableTextProps = {
  /** Class names forwarded to the wrapper element. */
  className?: string;
  /** The content key this field maps to (e.g. "hero.title"). */
  contentKey: string;
  /** Render as block (div) or inline (span). Defaults to "inline". */
  display?: "block" | "inline";
  /** Called with the new value when the user commits an inline edit. */
  onCommit?: (contentKey: string, value: string) => void;
  /** The current field value. */
  value: string;
};

/**
 * Renders a text node in live mode. In draft mode, the element becomes
 * contentEditable with a visible amber outline and a "Save" button overlay.
 */
export function EditableText({
  className,
  contentKey,
  display = "inline",
  onCommit,
  value,
}: EditableTextProps) {
  const isDraft = useIsDraftMode();
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef<HTMLElement>(null);

  if (!isDraft) {
    const Tag = display === "block" ? "div" : "span";
    return <Tag className={className}>{value}</Tag>;
  }

  function handleClick() {
    if (!editing) setEditing(true);
  }

  function handleBlur() {
    if (editing) {
      setEditing(false);
      if (localValue !== value) {
        onCommit?.(contentKey, localValue);
      }
    }
  }

  function handleInput(e: React.FormEvent<HTMLElement>) {
    setLocalValue((e.target as HTMLElement).innerText);
  }

  const Tag = display === "block" ? "div" : ("span" as "div" | "span");

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      className={[
        className,
        "relative cursor-text outline-none",
        editing
          ? "rounded ring-2 ring-primary/60"
          : "rounded ring-1 ring-amber-400/60 hover:ring-amber-500/80",
      ]
        .filter(Boolean)
        .join(" ")}
      contentEditable={editing}
      suppressContentEditableWarning
      onBlur={handleBlur}
      onClick={handleClick}
      onInput={handleInput}
    >
      {value}
    </Tag>
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
export function EditableRepeater<T>({ children, items }: EditableRepeaterProps<T>) {
  const isDraft = useIsDraftMode();

  return (
    <div className={isDraft ? "group/repeater relative" : undefined}>
      {items.map((item, i) => (
        <div
          key={i}
          className={isDraft ? "group/item relative" : undefined}
        >
          {isDraft && (
            <div className="pointer-events-none absolute left-0 top-1/2 z-10 -translate-x-6 -translate-y-1/2 opacity-0 transition-opacity group-hover/item:opacity-100">
              <span className="cursor-grab select-none text-muted-foreground/60" aria-hidden>
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
