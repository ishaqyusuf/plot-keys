"use client";

/**
 * Inline editing primitives for the builder CMS layer.
 *
 * These components render their content normally in live/preview mode and
 * expose editing affordances (hover border, text cursor, overlay button) in draft mode.
 *
 * Usage in section components:
 *   <EditableText contentKey="hero.title" value={content["hero.title"]} />
 *   <EditableImage slot="heroImage" src={imageUrl} alt="Hero" />
 */

import { type ReactNode, useEffect, useRef, useState } from "react";
import { Pencil, Sparkles, X } from "lucide-react";
import { isContentKeyAiEnabled } from "../register/content-field-lookup";
import { useIsDraftMode, useRegistry } from "../runtime-context";
import { useSmartFill } from "../runtime/smart-fill-context";

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

/**
 * Renders a text node in live mode. In draft mode, the element shows a
 * visible hover border and becomes contentEditable on click. When a
 * SmartFillProvider is present in the tree, a hover action bar appears with
 * Edit and AI icon buttons so users can trigger AI generation directly on the
 * text.
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
  const registry = useRegistry();
  const commitContent = onCommit ?? registry.commitContent;
  const aiAvailable =
    canUseAi && (aiEnabled ?? isContentKeyAiEnabled(contentKey));
  const triggerSmartFill = useSmartFill();
  const [editing, setEditing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? (display === "block" ? "div" : "span")) as "div" | "span";

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

  function handleClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();
    if (editing || isPending) return;
    setEditing(true);
    requestAnimationFrame(() => focusEditableElement(ref.current));
  }

  function handleInput(e: React.FormEvent<HTMLElement>) {
    setLocalValue((e.target as HTMLElement).innerText);
  }

  function handleBlur() {
    if (!editing) return;
    setEditing(false);
    if (localValue !== value) {
      void commitContent?.(contentKey, localValue);
    }
  }

  async function handleAiGenerate(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!aiAvailable || !triggerSmartFill || isPending) return;
    setIsPending(true);
    try {
      await triggerSmartFill(contentKey);
    } finally {
      setIsPending(false);
    }
  }

  function handleEditClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setEditing(true);
    requestAnimationFrame(() => focusEditableElement(ref.current));
  }

  const showActionBar = isHovered && !editing && !isPending;
  const baseShadow =
    typeof style?.boxShadow === "string" && style.boxShadow.length > 0
      ? `${style.boxShadow}, `
      : "";
  const hoverBorder =
    "color-mix(in srgb, var(--pk-primary, #2563eb) 72%, transparent)";
  const hoverBackground =
    "color-mix(in srgb, var(--pk-primary, #2563eb) 10%, transparent)";
  const activeBackground =
    "color-mix(in srgb, var(--pk-primary, #2563eb) 12%, transparent)";
  const contrastStroke = "color-mix(in srgb, white 78%, transparent)";
  const interactionBorder = isHovered || editing || isPending;
  const draftStyle: React.CSSProperties = {
    ...style,
    backgroundColor:
      isPending || editing
        ? activeBackground
        : isHovered
          ? hoverBackground
          : style?.backgroundColor,
    boxShadow: isPending
      ? `${baseShadow}0 0 0 1px ${contrastStroke}, 0 0 0 3px ${hoverBorder}, 0 12px 30px rgb(15 23 42 / 0.12)`
      : editing
        ? `${baseShadow}0 0 0 1px ${contrastStroke}, 0 0 0 3px ${hoverBorder}, 0 14px 32px rgb(15 23 42 / 0.16)`
        : isHovered
          ? `${baseShadow}0 0 0 1px ${contrastStroke}, 0 0 0 2px ${hoverBorder}, 0 10px 24px rgb(15 23 42 / 0.12)`
          : style?.boxShadow,
    borderRadius: style?.borderRadius ?? "0.45rem",
    boxDecorationBreak: "clone",
    WebkitBoxDecorationBreak: "clone",
    outline: interactionBorder ? `1px solid ${hoverBorder}` : style?.outline,
    outlineOffset: interactionBorder ? "3px" : style?.outlineOffset,
    cursor: "text",
    WebkitUserSelect: editing ? "text" : style?.WebkitUserSelect,
    userSelect: editing ? "text" : style?.userSelect,
  };

  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement & HTMLSpanElement>}
      style={draftStyle}
      className={[
        className,
        "relative !cursor-text rounded-[0.45rem] caret-[color:var(--pk-primary,#2563eb)] outline-none transition-[background-color,box-shadow,outline-color]",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--pk-primary,#2563eb)]/70 focus-visible:ring-offset-2",
        isPending
          ? "animate-pulse"
          : editing
            ? "shadow-lg shadow-slate-900/10"
            : "hover:shadow-lg hover:shadow-slate-900/10",
      ]
        .filter(Boolean)
        .join(" ")}
      contentEditable={editing}
      suppressContentEditableWarning
      tabIndex={0}
      title="Click to edit text"
      onBlur={handleBlur}
      onClick={handleClick}
      onInput={handleInput}
      onKeyDown={(event) => {
        if (!editing && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault();
          setEditing(true);
          requestAnimationFrame(() => focusEditableElement(ref.current));
          return;
        }

        if (event.key !== "Escape") return;
        event.preventDefault();
        setEditing(false);
        setLocalValue(value);
        requestAnimationFrame(() => {
          if (ref.current) {
            ref.current.innerText = value;
          }
        });
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Floating action bar — Edit + optional AI button */}
      {showActionBar && (
        <span
          className="absolute -top-7 right-0 z-20 flex items-center gap-0.5 rounded border border-border/60 bg-background/95 px-1 py-0.5 shadow-sm"
          contentEditable={false}
          onMouseEnter={() => setIsHovered(true)}
        >
          <button
            aria-label="Edit text"
            type="button"
            title="Edit text"
            className="flex size-5 items-center justify-center rounded text-muted-foreground hover:bg-muted hover:text-foreground"
            onMouseDown={handleEditClick}
          >
            <Pencil className="size-3.5" />
          </button>
          {triggerSmartFill ? (
            <button
              aria-label="Generate with AI"
              type="button"
              title="Generate with AI"
              className="flex size-5 items-center justify-center rounded text-primary hover:bg-primary/10"
              onMouseDown={handleAiGenerate}
            >
              <Sparkles className="size-3.5" />
            </button>
          ) : null}
        </span>
      )}
      {localValue}
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
                aria-label="Cancel image replacement"
                className="rounded border border-border/60 bg-background/90 px-2 py-1 text-xs text-muted-foreground"
                type="button"
                onClick={() => setReplacing(false)}
              >
                <X className="size-3.5" />
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
