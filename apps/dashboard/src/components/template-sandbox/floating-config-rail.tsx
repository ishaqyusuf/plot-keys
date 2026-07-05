"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { TooltipProvider } from "@plotkeys/ui/tooltip";
import { Menu } from "lucide-react";

const previewScrollSelector = "[data-template-preview-scroll]";
const selectOpenAttribute = "data-template-config-select-open";
const railCollapseScrollThreshold = 4;
const railExpandedWidthClassName = "data-[state=expanded]:w-[14.5rem]";
const railExpandedContentClassName =
  "group-data-[state=expanded]/config:block";

type RailPreference = "auto" | "collapsed" | "expanded";

type FloatingConfigRailContextValue = {
  expanded: boolean;
  preference: RailPreference;
  togglePreference: () => void;
};

const FloatingConfigRailContext =
  createContext<FloatingConfigRailContextValue | null>(null);

function getNextRailPreference(preference: RailPreference): RailPreference {
  if (preference === "auto") return "expanded";
  if (preference === "expanded") return "collapsed";
  return "auto";
}

function getRailMenuActionLabel(preference: RailPreference) {
  if (preference === "auto") return "Pin template menu open";
  if (preference === "expanded") return "Collapse template menu";
  return "Restore automatic template menu";
}

function useFloatingConfigRail() {
  const context = useContext(FloatingConfigRailContext);
  if (!context) {
    throw new Error(
      "FloatingConfigRailMenuButton must be rendered inside FloatingConfigRail.",
    );
  }
  return context;
}

export function FloatingConfigRail({ children }: { children: ReactNode }) {
  const railRef = useRef<HTMLElement>(null);
  const hoverSuppressedRef = useRef(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [hoverSuppressed, setHoverSuppressed] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [preference, setPreference] = useState<RailPreference>("auto");

  function syncHoverSuppressed(nextHoverSuppressed: boolean) {
    hoverSuppressedRef.current = nextHoverSuppressed;
    setHoverSuppressed(nextHoverSuppressed);
  }

  useEffect(() => {
    let raf = 0;
    let attachedScroller: HTMLElement | null = null;

    function readPreviewScrollState() {
      const previewScroller =
        document.querySelector<HTMLElement>(previewScrollSelector);
      if (!previewScroller) return;

      const nextHasScrolled =
        previewScroller.scrollTop > railCollapseScrollThreshold;

      setHasScrolled(nextHasScrolled);

      if (nextHasScrolled) {
        syncHoverSuppressed(true);
        setIsInteracting(false);
      } else {
        syncHoverSuppressed(false);
      }
    }

    function schedulePreviewScrollStateSync() {
      if (raf) return;

      raf = window.requestAnimationFrame(() => {
        raf = 0;
        readPreviewScrollState();
      });
    }

    function attachPreviewScroller() {
      const nextScroller =
        document.querySelector<HTMLElement>(previewScrollSelector);

      if (nextScroller === attachedScroller) return;

      attachedScroller?.removeEventListener(
        "scroll",
        schedulePreviewScrollStateSync,
      );
      attachedScroller = nextScroller;
      attachedScroller?.addEventListener(
        "scroll",
        schedulePreviewScrollStateSync,
        {
          passive: true,
        },
      );
      schedulePreviewScrollStateSync();
    }

    const observer = new MutationObserver(attachPreviewScroller);

    attachPreviewScroller();
    observer.observe(document.body, { childList: true, subtree: true });
    window.addEventListener("scroll", schedulePreviewScrollStateSync, true);
    window.addEventListener("wheel", schedulePreviewScrollStateSync, {
      capture: true,
      passive: true,
    });

    const interval = window.setInterval(schedulePreviewScrollStateSync, 250);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      observer.disconnect();
      attachedScroller?.removeEventListener(
        "scroll",
        schedulePreviewScrollStateSync,
      );
      window.clearInterval(interval);
      window.removeEventListener("scroll", schedulePreviewScrollStateSync, true);
      window.removeEventListener("wheel", schedulePreviewScrollStateSync, true);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    function syncSelectOpenState() {
      setIsSelectOpen(root.hasAttribute(selectOpenAttribute));
    }

    syncSelectOpenState();

    const observer = new MutationObserver(syncSelectOpenState);
    observer.observe(root, {
      attributeFilter: [selectOpenAttribute],
      attributes: true,
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      const rail = railRef.current;
      if (!rail) return;

      const rect = rail.getBoundingClientRect();
      const pointerInsideRail =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      setIsInteracting(pointerInsideRail && !hoverSuppressedRef.current);
    }

    window.addEventListener("pointermove", handlePointerMove, true);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove, true);
    };
  }, []);

  const interactionExpanded = isInteracting || isSelectOpen;
  const autoExpanded = !hasScrolled || interactionExpanded;
  const expanded =
    preference === "expanded" ||
    (preference === "collapsed" ? interactionExpanded : autoExpanded);

  return (
    <FloatingConfigRailContext.Provider
      value={{
        expanded,
        preference,
        togglePreference: () =>
          setPreference((currentPreference) =>
            getNextRailPreference(currentPreference),
          ),
      }}
    >
      <aside
        aria-expanded={expanded}
        aria-label="Template configuration"
        className={[
          "group/config fixed bottom-4 left-4 top-4 z-[80] flex w-14 max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[0.95rem]",
          "border border-white/10 bg-zinc-950/95 text-zinc-50 shadow-[0_24px_70px_rgb(0_0_0_/_0.32)] backdrop-blur-xl",
          "transition-[width] duration-300 ease-out",
          railExpandedWidthClassName,
        ].join(" ")}
        data-has-scrolled={hasScrolled ? "true" : "false"}
        data-hover-suppressed={hoverSuppressed ? "true" : "false"}
        data-interacting={isInteracting ? "true" : "false"}
        data-preference={preference}
        data-select-open={isSelectOpen ? "true" : "false"}
        data-state={expanded ? "expanded" : "collapsed"}
        ref={railRef}
        onBlurCapture={(event) => {
          if (
            event.relatedTarget instanceof Node &&
            railRef.current?.contains(event.relatedTarget)
          ) {
            return;
          }
          setIsInteracting(false);
        }}
        onFocusCapture={() => {
          syncHoverSuppressed(false);
          setIsInteracting(true);
        }}
        onMouseEnter={() => {
          if (!hoverSuppressedRef.current) setIsInteracting(true);
        }}
        onMouseLeave={() => {
          syncHoverSuppressed(false);
          setIsInteracting(false);
        }}
      >
        <TooltipProvider delayDuration={120}>{children}</TooltipProvider>
      </aside>
    </FloatingConfigRailContext.Provider>
  );
}

export function FloatingConfigRailMenuButton() {
  const { expanded, preference, togglePreference } = useFloatingConfigRail();
  const actionLabel = getRailMenuActionLabel(preference);

  return (
    <button
      aria-expanded={expanded}
      aria-label={actionLabel}
      className="flex h-10 w-full min-w-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] px-2 text-zinc-100 transition-colors hover:border-white/20 hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 group-data-[state=expanded]/config:justify-between"
      title={actionLabel}
      type="button"
      onClick={togglePreference}
    >
      <span
        className={[
          "hidden min-w-0 truncate text-xs font-semibold",
          railExpandedContentClassName,
        ].join(" ")}
      >
        Menu
      </span>
      <Menu className="size-4 shrink-0" />
    </button>
  );
}
