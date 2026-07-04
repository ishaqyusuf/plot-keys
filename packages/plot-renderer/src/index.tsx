"use client";

import { useMemo } from "react";

export type PlotStatus = "available" | "held" | "reserved" | "sold" | "blocked";

export type PlotGeometry = {
  layoutVersion?: number;
  shape: "polygon";
  points: Array<{ x: number; y: number }>;
  source?: string;
  confidence?: string;
};

export type RenderablePlot = {
  id: string;
  plotCode?: string | null;
  status: PlotStatus;
  block?: string | null;
  street?: string | null;
  sizeSqm?: number | null;
  price?: string | null;
  coordinatesJson?: unknown;
};

export type PlotStatusUpdate = {
  plotId: string;
  status: PlotStatus;
};

export type PlotLayoutRendererProps = {
  imageUrl: string;
  imageWidth: number;
  imageHeight: number;
  plots: RenderablePlot[];
  selectedPlotId?: string | null;
  disabledStatuses?: PlotStatus[];
  plotStatusById?: Record<string, PlotStatus>;
  statusUpdates?: PlotStatusUpdate[];
  className?: string;
  onPlotSelect?: (plot: RenderablePlot) => void;
  onPlotHover?: (plot: RenderablePlot | null) => void;
  onPlotFocus?: (plot: RenderablePlot | null) => void;
  onInvalidPlot?: (plot: RenderablePlot, reason: string) => void;
};

type RenderablePlotWithGeometry = {
  plot: RenderablePlot;
  status: PlotStatus;
  geometry: PlotGeometry;
};

const defaultDisabledStatuses: PlotStatus[] = [
  "held",
  "reserved",
  "sold",
  "blocked",
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFiniteUnitValue(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  );
}

export function normalizePlotGeometry(value: unknown): PlotGeometry | null {
  if (!isRecord(value)) return null;
  if (value.shape !== "polygon") return null;
  if (!Array.isArray(value.points) || value.points.length < 3) return null;

  const points = value.points
    .map((point) => {
      if (!isRecord(point)) return null;
      if (!isFiniteUnitValue(point.x) || !isFiniteUnitValue(point.y))
        return null;
      return { x: point.x, y: point.y };
    })
    .filter((point): point is { x: number; y: number } => Boolean(point));

  if (points.length !== value.points.length || points.length < 3) return null;

  return {
    confidence:
      typeof value.confidence === "string" ? value.confidence : undefined,
    layoutVersion:
      typeof value.layoutVersion === "number" &&
      Number.isFinite(value.layoutVersion)
        ? value.layoutVersion
        : undefined,
    points,
    shape: "polygon",
    source: typeof value.source === "string" ? value.source : undefined,
  };
}

export function isRenderablePlot(plot: RenderablePlot) {
  return normalizePlotGeometry(plot.coordinatesJson) !== null;
}

export function toSvgPoints(points: PlotGeometry["points"]) {
  return points.map((point) => `${point.x},${point.y}`).join(" ");
}

export function getPlotStatusStyle(status: PlotStatus, selected = false) {
  if (selected) {
    return {
      fill: "rgba(20, 184, 166, 0.52)",
      stroke: "rgb(15, 118, 110)",
      strokeWidth: 0.006,
    };
  }

  switch (status) {
    case "available":
      return {
        fill: "rgba(34, 197, 94, 0.28)",
        stroke: "rgb(22, 163, 74)",
        strokeWidth: 0.0035,
      };
    case "held":
      return {
        fill: "rgba(245, 158, 11, 0.3)",
        stroke: "rgb(217, 119, 6)",
        strokeWidth: 0.003,
      };
    case "reserved":
      return {
        fill: "rgba(59, 130, 246, 0.3)",
        stroke: "rgb(37, 99, 235)",
        strokeWidth: 0.003,
      };
    case "sold":
      return {
        fill: "rgba(71, 85, 105, 0.34)",
        stroke: "rgb(51, 65, 85)",
        strokeWidth: 0.003,
      };
    case "blocked":
      return {
        fill: "rgba(239, 68, 68, 0.3)",
        stroke: "rgb(220, 38, 38)",
        strokeWidth: 0.003,
      };
  }
}

function plotLabel(plot: RenderablePlot, status: PlotStatus) {
  return [
    plot.plotCode ? `Plot ${plot.plotCode}` : "Unnamed plot",
    plot.street,
    plot.block,
    plot.sizeSqm ? `${plot.sizeSqm} sqm` : null,
    status,
  ]
    .filter(Boolean)
    .join(", ");
}

const visuallyHiddenStyle = {
  border: 0,
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  margin: -1,
  overflow: "hidden",
  padding: 0,
  position: "absolute",
  whiteSpace: "nowrap",
  width: 1,
} satisfies React.CSSProperties;

export function PlotLayoutRenderer({
  className,
  disabledStatuses = defaultDisabledStatuses,
  imageHeight,
  imageUrl,
  imageWidth,
  onInvalidPlot,
  onPlotFocus,
  onPlotHover,
  onPlotSelect,
  plots,
  plotStatusById,
  selectedPlotId,
  statusUpdates,
}: PlotLayoutRendererProps) {
  const liveStatusById = useMemo(() => {
    const next = { ...(plotStatusById ?? {}) };
    for (const update of statusUpdates ?? []) {
      next[update.plotId] = update.status;
    }
    return next;
  }, [plotStatusById, statusUpdates]);

  const renderablePlots = useMemo(() => {
    const next: RenderablePlotWithGeometry[] = [];

    for (const plot of plots) {
      const geometry = normalizePlotGeometry(plot.coordinatesJson);

      if (!geometry) {
        onInvalidPlot?.(plot, "Missing or invalid polygon coordinates.");
        continue;
      }

      next.push({
        geometry,
        plot,
        status: liveStatusById[plot.id] ?? plot.status,
      });
    }

    return next;
  }, [liveStatusById, onInvalidPlot, plots]);

  const disabledSet = useMemo(
    () => new Set<PlotStatus>(disabledStatuses),
    [disabledStatuses],
  );
  const aspectRatio =
    imageWidth > 0 && imageHeight > 0
      ? `${imageWidth} / ${imageHeight}`
      : undefined;

  return (
    <div
      className={className}
      style={{
        aspectRatio,
        backgroundColor: "#f8fafc",
        position: "relative",
        width: "100%",
      }}
    >
      {/* biome-ignore lint/performance/noImgElement: This shared renderer cannot depend on Next Image. */}
      <img
        alt="Estate layout"
        draggable={false}
        src={imageUrl}
        style={{
          display: "block",
          height: "100%",
          inset: 0,
          objectFit: "contain",
          position: "absolute",
          userSelect: "none",
          width: "100%",
        }}
      />
      <svg
        aria-label="Selectable estate plots"
        preserveAspectRatio="none"
        style={{
          height: "100%",
          inset: 0,
          position: "absolute",
          touchAction: "manipulation",
          width: "100%",
        }}
        viewBox="0 0 1 1"
      >
        {renderablePlots.map(({ geometry, plot, status }) => {
          const selected = plot.id === selectedPlotId;
          const disabled = disabledSet.has(status);
          const style = getPlotStatusStyle(status, selected);

          return (
            <g key={plot.id}>
              <title>{plotLabel(plot, status)}</title>
              {/* biome-ignore lint/a11y/noStaticElementInteractions: SVG polygons provide pointer hit areas; hidden buttons below provide semantic keyboard controls. */}
              <polygon
                data-selected={selected ? "true" : undefined}
                fill={style.fill}
                onClick={() => {
                  if (!disabled) onPlotSelect?.(plot);
                }}
                onMouseEnter={() => onPlotHover?.(plot)}
                onMouseLeave={() => onPlotHover?.(null)}
                points={toSvgPoints(geometry.points)}
                stroke={style.stroke}
                strokeLinejoin="round"
                strokeWidth={style.strokeWidth}
                style={{
                  cursor: disabled ? "not-allowed" : "pointer",
                  filter: selected
                    ? "drop-shadow(0 0 0.015px rgba(15,118,110,0.8))"
                    : undefined,
                  opacity: disabled && !selected ? 0.66 : 1,
                  outline: "none",
                }}
              />
            </g>
          );
        })}
      </svg>
      <fieldset
        aria-label="Plot selection controls"
        style={visuallyHiddenStyle}
      >
        {renderablePlots.map(({ plot, status }) => {
          const selected = plot.id === selectedPlotId;
          const disabled = disabledSet.has(status);

          return (
            <button
              aria-pressed={selected}
              disabled={disabled}
              key={plot.id}
              onBlur={() => onPlotFocus?.(null)}
              onClick={() => onPlotSelect?.(plot)}
              onFocus={() => onPlotFocus?.(plot)}
              style={visuallyHiddenStyle}
              type="button"
            >
              {plotLabel(plot, status)}
            </button>
          );
        })}
      </fieldset>
    </div>
  );
}
