import type { RenderMode } from "@plotkeys/section-registry";

const supportedRenderModes = new Set<RenderMode>([
  "live",
  "draft",
  "preview",
  "template",
]);

export function parseTenantRenderMode(
  value: string | null | undefined,
): RenderMode {
  if (!value) return "live";
  return supportedRenderModes.has(value as RenderMode)
    ? (value as RenderMode)
    : "live";
}
