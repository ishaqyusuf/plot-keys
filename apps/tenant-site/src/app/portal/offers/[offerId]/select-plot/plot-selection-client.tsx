"use client";

import {
  PlotLayoutRenderer,
  type PlotStatus,
  type RenderablePlot,
} from "@plotkeys/plot-renderer";
import { useMemo, useState } from "react";

import { selectPreferredPlotAction } from "../../../actions";

type PlotSelectionClientProps = {
  offerId: string;
  imageHeight: number;
  imageUrl: string;
  imageWidth: number;
  initialSelectedPlotId?: string | null;
  plots: RenderablePlot[];
};

const disabledStatuses: PlotStatus[] = ["held", "reserved", "sold", "blocked"];

export function PlotSelectionClient({
  offerId,
  imageHeight,
  imageUrl,
  imageWidth,
  initialSelectedPlotId,
  plots,
}: PlotSelectionClientProps) {
  const [selectedPlotId, setSelectedPlotId] = useState<string | null>(
    initialSelectedPlotId ?? null,
  );
  const [hoveredPlot, setHoveredPlot] = useState<RenderablePlot | null>(null);
  const selectedPlot = useMemo(
    () => plots.find((plot) => plot.id === selectedPlotId) ?? null,
    [plots, selectedPlotId],
  );
  const hasPersistedSelection = Boolean(initialSelectedPlotId);

  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="overflow-hidden rounded-[1.5rem] border border-[color:var(--pk-border,#e2e8f0)] bg-white shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <PlotLayoutRenderer
          className="min-h-[520px]"
          disabledStatuses={disabledStatuses}
          imageHeight={imageHeight}
          imageUrl={imageUrl}
          imageWidth={imageWidth}
          onPlotHover={setHoveredPlot}
          onPlotSelect={(plot) => {
            if (!hasPersistedSelection) setSelectedPlotId(plot.id);
          }}
          plots={plots}
          selectedPlotId={selectedPlotId}
        />
      </div>

      <aside className="rounded-[1.5rem] border border-[color:var(--pk-border,#e2e8f0)] bg-[color:var(--pk-card,#ffffff)] p-5 shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[color:var(--pk-muted-foreground,#64748b)]">
          Preferred plot
        </p>
        <div className="mt-4 space-y-3 text-sm text-[color:var(--pk-muted-foreground,#64748b)]">
          {selectedPlot ? (
            <>
              <p className="text-xl font-semibold text-[color:var(--pk-foreground,#0f172a)]">
                Plot {selectedPlot.plotCode ?? "Unnamed"}
              </p>
              <p>
                {[selectedPlot.street, selectedPlot.block]
                  .filter(Boolean)
                  .join(" · ") || "Estate plot"}
              </p>
              <p>
                {selectedPlot.sizeSqm
                  ? `${selectedPlot.sizeSqm} sqm`
                  : "Size not set"}
                {selectedPlot.price ? ` · ${selectedPlot.price}` : ""}
              </p>
              <p className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                {hasPersistedSelection ? "Reserved" : "Selected"}
              </p>
            </>
          ) : (
            <p>
              Click an available plot on the render to choose your preferred
              unit.
            </p>
          )}
          {hoveredPlot && hoveredPlot.id !== selectedPlotId ? (
            <p className="rounded-2xl border border-[color:var(--pk-border,#e2e8f0)] px-3 py-2">
              Hovering: Plot {hoveredPlot.plotCode ?? "Unnamed"}
            </p>
          ) : null}
        </div>

        {hasPersistedSelection ? (
          <p className="mt-5 text-sm leading-7 text-[color:var(--pk-muted-foreground,#64748b)]">
            Your preferred plot has been reserved for this accepted offer.
          </p>
        ) : (
          <form action={selectPreferredPlotAction} className="mt-5 space-y-3">
            <input name="offerId" type="hidden" value={offerId} />
            <input name="plotId" type="hidden" value={selectedPlotId ?? ""} />
            <input
              name="redirectTo"
              type="hidden"
              value={`/portal/offers/${offerId}/select-plot`}
            />
            <button
              className="inline-flex w-full items-center justify-center rounded-2xl bg-[color:var(--pk-primary,#0f766e)] px-4 py-3 text-sm font-semibold text-[color:var(--pk-primary-foreground,#ffffff)] shadow-sm transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selectedPlotId}
              type="submit"
            >
              Reserve selected plot
            </button>
          </form>
        )}
      </aside>
    </div>
  );
}
