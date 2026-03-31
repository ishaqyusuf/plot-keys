"use client";

/**
 * ClickGuard — intercepts user interactions in non-live render modes.
 *
 * Wraps page content and captures clicks in "template" and "preview" modes
 * so that:
 *  - Anchor/Link clicks → preventDefault (no navigation)
 *  - Form submit clicks → preventDefault (no real submission)
 *  - All button clicks → swallowed (no side effects)
 *  - CTA button clicks → swallowed with a brief visual flash
 *
 * In "live" mode the ClickGuard is a transparent passthrough.
 *
 * Usage:
 *   <ClickGuardProvider>
 *     {/* sections *\/}
 *   </ClickGuardProvider>
 *
 *   // Inside sections, open an item overview with:
 *   const { openItem } = useClickGuard();
 *   openItem({ type: "listing", data: listingPayload });
 */

import {
  createContext,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRenderMode } from "../runtime-context";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClickGuardItemType = "listing" | "agent" | "project" | "service";

export type ClickGuardItem = {
  data: Record<string, unknown>;
  type: ClickGuardItemType;
};

type ClickGuardContextValue = {
  activeItem: ClickGuardItem | null;
  closeItem: () => void;
  openItem: (item: ClickGuardItem) => void;
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const ClickGuardContext = createContext<ClickGuardContextValue>({
  activeItem: null,
  closeItem: () => {},
  openItem: () => {},
});

// ---------------------------------------------------------------------------
// Preview toast — brief "Action disabled in preview" indicator
// ---------------------------------------------------------------------------

function PreviewToast({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-[9999] -translate-x-1/2 rounded-full border border-amber-300/40 bg-amber-50 px-4 py-2 text-xs font-medium text-amber-800 shadow-lg transition-opacity duration-300 dark:border-amber-700/40 dark:bg-amber-950/80 dark:text-amber-200"
    >
      Action disabled in preview
    </div>
  );
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function ClickGuardProvider({ children }: { children: ReactNode }) {
  const renderMode = useRenderMode();
  const [activeItem, setActiveItem] = useState<ClickGuardItem | null>(null);
  const [showToast, setShowToast] = useState(false);

  const openItem = useCallback((item: ClickGuardItem) => {
    setActiveItem(item);
  }, []);

  const closeItem = useCallback(() => {
    setActiveItem(null);
  }, []);

  // Auto-hide toast after a short delay.
  useEffect(() => {
    if (!showToast) return;
    const timer = setTimeout(() => setShowToast(false), 1500);
    return () => clearTimeout(timer);
  }, [showToast]);

  // In live mode, render children with no interception.
  if (renderMode === "live") {
    return (
      <ClickGuardContext.Provider value={{ activeItem, closeItem, openItem }}>
        {children}
      </ClickGuardContext.Provider>
    );
  }

  function handleClick(e: MouseEvent<HTMLDivElement>) {
    const target = e.target as HTMLElement;

    // Intercept anchor / Next.js Link clicks — prevent navigation.
    const anchor = target.closest("a");
    if (anchor) {
      e.preventDefault();
      e.stopPropagation();
      // Auto-open InlineOverview if the anchor carries item data attributes.
      const itemType = (anchor as HTMLElement).dataset.clickGuardType as
        | ClickGuardItemType
        | undefined;
      const itemData = (anchor as HTMLElement).dataset.clickGuardData;
      if (itemType && itemData) {
        try {
          openItem({ type: itemType, data: JSON.parse(itemData) });
        } catch {
          // ignore malformed JSON
        }
      }
      return;
    }

    // Intercept all button clicks — covers submit, button, and untyped buttons.
    const button = target.closest("button");
    if (button) {
      e.preventDefault();
      e.stopPropagation();
      setShowToast(true);
      return;
    }

    // Intercept form element clicks as a fallback.
    const formEl = target.closest("form");
    if (formEl) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }

  return (
    <ClickGuardContext.Provider value={{ activeItem, closeItem, openItem }}>
      {/* biome-ignore lint/a11y/useKeyWithClickEvents: ClickGuard is a transparent interception layer, not an interactive control */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Wrapper div intercepts events; not a semantic interactive element */}
      <div className="relative" onClick={handleClick}>
        {children}
        <PreviewToast visible={showToast} />
      </div>
    </ClickGuardContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useClickGuard(): ClickGuardContextValue {
  return useContext(ClickGuardContext);
}
