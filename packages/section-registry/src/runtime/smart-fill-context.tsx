"use client";

/**
 * SmartFillContext — provides an AI content-generation function to any
 * descendant EditableText component.
 *
 * The builder wires its own `smartFillField` tRPC mutation into this context.
 * Section components (and EditableText itself) have no knowledge of the mutation
 * or the API layer — they simply call `triggerSmartFill(contentKey)`.
 *
 * In non-builder contexts (live tenant-site, preview) the context is absent and
 * `useSmartFill()` returns null, so the AI button is never rendered.
 *
 * Usage:
 *   // Builder preview panel
 *   <SmartFillProvider onSmartFill={async (key) => { await mutation(key); }}>
 *     {sections}
 *   </SmartFillProvider>
 *
 *   // Inside EditableText (automatic — no prop needed)
 *   const triggerSmartFill = useSmartFill();
 *   if (triggerSmartFill) { ... show AI button ... }
 */

import { createContext, useContext, type ReactNode } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Function that triggers AI content generation for a given content key. */
export type SmartFillFn = (contentKey: string) => Promise<void>;

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const SmartFillContext = createContext<SmartFillFn | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function SmartFillProvider({
  children,
  onSmartFill,
}: {
  children: ReactNode;
  onSmartFill: SmartFillFn;
}) {
  return (
    <SmartFillContext.Provider value={onSmartFill}>
      {children}
    </SmartFillContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

/**
 * Returns the SmartFill function if a SmartFillProvider is in the tree,
 * otherwise returns null. EditableText uses this to decide whether to render
 * the AI action button.
 */
export function useSmartFill(): SmartFillFn | null {
  return useContext(SmartFillContext);
}
