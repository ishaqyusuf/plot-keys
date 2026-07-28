"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevQuickFill must not be imported in production.");
}

import { Button } from "@plotkeys/ui/button";

type QuickFillPreset<T extends Record<string, string>> = {
  label: string;
  values: T;
};

type DevQuickFillInput<T extends Record<string, string>> = {
  presets: QuickFillPreset<T>[];
  onFill: (values: T) => void;
};

export function DevQuickFill<T extends Record<string, string>>({
  presets,
  onFill,
}: DevQuickFillInput<T>) {
  return (
    <div className="flex items-center gap-2 border border-border bg-background px-3 py-2 text-xs">
      <span className="font-mono font-semibold text-muted-foreground">DEV</span>
      <span className="text-muted-foreground">Quick fill:</span>
      {presets.map((preset) => (
        <Button
          variant="outline"
          size="sm"
          className="h-6 px-2 font-mono text-[11px]"
          key={preset.label}
          type="button"
          onClick={() => onFill(preset.values)}
        >
          {preset.label}
        </Button>
      ))}
    </div>
  );
}
