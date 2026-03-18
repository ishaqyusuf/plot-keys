"use client";

if (process.env.NODE_ENV === "production") {
  throw new Error("DevQuickFill must not be imported in production.");
}

type QuickFillPreset<T extends Record<string, string>> = {
  label: string;
  values: T;
};

type DevQuickFillProps<T extends Record<string, string>> = {
  presets: QuickFillPreset<T>[];
  onFill: (values: T) => void;
};

export function DevQuickFill<T extends Record<string, string>>({
  presets,
  onFill,
}: DevQuickFillProps<T>) {
  return (
    <div className="flex items-center gap-2 rounded border border-dashed border-amber-400 bg-amber-50 px-3 py-2 text-xs dark:bg-amber-950/30">
      <span className="font-mono font-semibold text-amber-600 dark:text-amber-400">
        DEV
      </span>
      <span className="text-amber-700 dark:text-amber-300">Quick fill:</span>
      {presets.map((preset) => (
        <button
          key={preset.label}
          type="button"
          className="rounded bg-amber-200 px-2 py-0.5 font-mono text-amber-800 hover:bg-amber-300 dark:bg-amber-800 dark:text-amber-100 dark:hover:bg-amber-700"
          onClick={() => onFill(preset.values)}
        >
          {preset.label}
        </button>
      ))}
    </div>
  );
}
