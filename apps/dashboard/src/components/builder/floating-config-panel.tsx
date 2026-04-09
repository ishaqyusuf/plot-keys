"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Icon } from "@plotkeys/ui/icons";
import { cn } from "@plotkeys/ui/lib/utils";
import { useState } from "react";

type PanelState = "expanded" | "collapsed" | "fab";

const COLLAPSED_ICONS = [
  { icon: Icon.Settings, label: "Config" },
  { icon: Icon.File, label: "Pages" },
  { icon: Icon.Builder, label: "Style" },
  { icon: Icon.Sparkles, label: "AI" },
  { icon: Icon.Image, label: "Images" },
] as const;

export function FloatingConfigPanel({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<PanelState>("expanded");
  const [hovered, setHovered] = useState(false);

  const isExpanded = state === "expanded" || (state === "collapsed" && hovered);
  const isFab = state === "fab";

  return (
    <>
      {/* Main panel — hidden (slides out) in fab state */}
      <div
        className={cn(
          "fixed left-3 top-3 z-40 flex h-[calc(100svh-1.5rem)] flex-col",
          "overflow-hidden rounded-xl border border-border/70 bg-card shadow-[var(--shadow-soft)]",
          "transition-[width,opacity,transform] duration-200 ease-in-out",
          isExpanded ? "w-[14rem]" : "w-10",
          isFab
            ? "-translate-x-[calc(100%+0.75rem)] opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100",
        )}
        onMouseEnter={() => state === "collapsed" && setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Header — flex-row-reverse keeps the collapse button at the right edge, always visible at w-10 */}
        <div className="shrink-0 border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)]">
          <div className="flex flex-row-reverse items-center gap-2 px-2 py-3">
            <button
              onClick={() => {
                setState((s) => (s === "expanded" ? "collapsed" : "expanded"));
                setHovered(false);
              }}
              className="shrink-0 rounded-md p-1.5 transition-colors hover:bg-muted/80"
              title={state === "expanded" ? "Collapse panel" : "Expand panel"}
            >
              <Icon.ChevronLeft
                className={cn(
                  "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                  !isExpanded && "rotate-180",
                )}
              />
            </button>
            <div className="flex min-w-0 flex-1 items-center justify-between gap-2 overflow-hidden">
              <p className="whitespace-nowrap text-xs uppercase tracking-[0.34em] text-muted-foreground">
                Website config
              </p>
              <Badge variant="outline" className="shrink-0">
                Studio
              </Badge>
            </div>
          </div>
        </div>

        {/* Scrollable content — always w-[14rem], clips via parent overflow-hidden */}
        <div className="flex-1 overflow-hidden">
          <div className="flex h-full w-[14rem] flex-col gap-4 overflow-y-auto p-4">
            {children}
          </div>
        </div>

        {/* Icon strip + FAB toggle — shown when icon-strip collapsed */}
        {state === "collapsed" && !hovered && (
          <div className="absolute inset-x-0 bottom-0 top-[3.25rem] flex flex-col items-center gap-4 py-3">
            {COLLAPSED_ICONS.map(({ icon: IconComp, label }) => (
              <IconComp
                key={label}
                className="h-4 w-4 text-muted-foreground/70"
              />
            ))}
            {/* Extra collapse → FAB */}
            <div className="flex-1" />
            <button
              onClick={(e) => {
                e.stopPropagation();
                setState("fab");
                setHovered(false);
              }}
              className="mb-1 rounded-md p-1.5 transition-colors hover:bg-muted/80"
              title="Minimize to corner button"
            >
              <Icon.PanelLeft className="h-3.5 w-3.5 rotate-180 text-muted-foreground/70" />
            </button>
          </div>
        )}
      </div>

      {/* FAB — bottom-left corner button shown only in fab state */}
      <button
        onClick={() => setState("expanded")}
        className={cn(
          "fixed bottom-4 left-4 z-40 flex h-10 w-10 items-center justify-center",
          "rounded-full border border-border/70 bg-card shadow-[var(--shadow-soft)]",
          "transition-[opacity,transform] duration-200 ease-in-out hover:bg-muted",
          isFab
            ? "opacity-100 scale-100 pointer-events-auto"
            : "opacity-0 scale-75 pointer-events-none",
        )}
        title="Show config panel"
      >
        <Icon.Settings className="h-4 w-4 text-muted-foreground" />
      </button>
    </>
  );
}
