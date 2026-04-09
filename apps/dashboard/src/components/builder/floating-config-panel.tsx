"use client";

import { Badge } from "@plotkeys/ui/badge";
import { Icon } from "@plotkeys/ui/icons";
import { cn } from "@plotkeys/ui/lib/utils";
import { useState } from "react";

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
  const [collapsed, setCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const isExpanded = !collapsed || hovered;

  return (
    <div
      className={cn(
        "fixed left-3 top-3 z-40 flex h-[calc(100svh-1.5rem)] flex-col",
        "overflow-hidden rounded-xl border border-border/70 bg-card shadow-[var(--shadow-soft)]",
        "transition-[width] duration-200 ease-in-out",
        isExpanded ? "w-[14rem]" : "w-10",
      )}
      onMouseEnter={() => collapsed && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Header — flex-row-reverse keeps the button at the right edge, always visible at w-10 */}
      <div className="shrink-0 border-b border-border/70 bg-[linear-gradient(180deg,hsl(var(--primary)/0.14),transparent)]">
        <div className="flex flex-row-reverse items-center gap-2 px-2 py-3">
          <button
            onClick={() => {
              setCollapsed((c) => !c);
              setHovered(false);
            }}
            className="shrink-0 rounded-md p-1.5 transition-colors hover:bg-muted/80"
            title={collapsed ? "Expand panel" : "Collapse panel"}
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

      {/* Icon strip — shown when fully collapsed */}
      {!isExpanded && (
        <div className="absolute left-0 top-[3.25rem] flex w-10 flex-col items-center gap-4 py-3 pointer-events-none">
          {COLLAPSED_ICONS.map(({ icon: IconComp, label }) => (
            <IconComp
              key={label}
              className="h-4 w-4 text-muted-foreground/70"
            />
          ))}
        </div>
      )}
    </div>
  );
}
