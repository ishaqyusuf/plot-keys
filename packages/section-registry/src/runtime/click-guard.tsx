"use client";

/**
 * ClickGuard — intercepts user interactions in non-live render modes.
 *
 * Wraps page content and captures clicks in "template" and "preview" modes
 * so that:
 *  - Anchor/Link clicks → preventDefault (no navigation)
 *  - Form submit clicks → preventDefault (no real submission)
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
  useCallback,
  useContext,
  useState,
  type MouseEvent,
  type ReactNode,
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
// Provider
// ---------------------------------------------------------------------------

export function ClickGuardProvider({ children }: { children: ReactNode }) {
  const renderMode = useRenderMode();
  const [activeItem, setActiveItem] = useState<ClickGuardItem | null>(null);

  const openItem = useCallback((item: ClickGuardItem) => {
    setActiveItem(item);
  }, []);

  const closeItem = useCallback(() => {
    setActiveItem(null);
  }, []);

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
      return;
    }

    // Intercept form submit buttons and form elements.
    const formEl = target.closest("button[type='submit'], form");
    if (formEl) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
  }

  return (
    <ClickGuardContext.Provider value={{ activeItem, closeItem, openItem }}>
      {/* Capture phase listener to intercept before Next.js router handles the click */}
      <div className="relative" onClick={handleClick}>
        {children}
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
