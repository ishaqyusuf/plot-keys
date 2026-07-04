import { describe, expect, it } from "bun:test";

import {
  getPlotStatusStyle,
  isRenderablePlot,
  normalizePlotGeometry,
  type RenderablePlot,
  toSvgPoints,
} from ".";

describe("normalizePlotGeometry", () => {
  it("accepts normalized polygon geometry", () => {
    const geometry = normalizePlotGeometry({
      layoutVersion: 1,
      shape: "polygon",
      points: [
        { x: 0.1, y: 0.2 },
        { x: 0.4, y: 0.2 },
        { x: 0.4, y: 0.6 },
      ],
    });

    expect(geometry?.points).toEqual([
      { x: 0.1, y: 0.2 },
      { x: 0.4, y: 0.2 },
      { x: 0.4, y: 0.6 },
    ]);
  });

  it("rejects missing, unsupported, or out-of-range geometry", () => {
    expect(normalizePlotGeometry(null)).toBeNull();
    expect(
      normalizePlotGeometry({
        shape: "circle",
        points: [{ x: 0.1, y: 0.2 }],
      }),
    ).toBeNull();
    expect(
      normalizePlotGeometry({
        shape: "polygon",
        points: [
          { x: 0.1, y: 0.2 },
          { x: 1.4, y: 0.2 },
          { x: 0.4, y: 0.6 },
        ],
      }),
    ).toBeNull();
  });
});

describe("plot helpers", () => {
  it("serializes SVG points", () => {
    expect(
      toSvgPoints([
        { x: 0.1, y: 0.2 },
        { x: 0.4, y: 0.2 },
      ]),
    ).toBe("0.1,0.2 0.4,0.2");
  });

  it("marks plots with valid geometry as renderable", () => {
    const plot: RenderablePlot = {
      coordinatesJson: {
        shape: "polygon",
        points: [
          { x: 0, y: 0 },
          { x: 1, y: 0 },
          { x: 1, y: 1 },
        ],
      },
      id: "plot-1",
      status: "available",
    };

    expect(isRenderablePlot(plot)).toBe(true);
    expect(isRenderablePlot({ ...plot, coordinatesJson: null })).toBe(false);
  });

  it("returns a distinct selected style", () => {
    expect(getPlotStatusStyle("available", true).stroke).not.toBe(
      getPlotStatusStyle("available").stroke,
    );
  });
});
