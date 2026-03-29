"use client";

/**
 * InlineOverview — slide-up panel shown when a listing, agent, or project
 * card is clicked in non-live render modes.
 *
 * Behaviour by render mode:
 *  - "template": Shows placeholder item data + "Install template" CTA.
 *  - "draft" / "preview": Shows real item data + "Enquire" action link.
 *  - "live": Never shown — ClickGuard is transparent in live mode.
 *
 * Consumed via the ClickGuard context:
 *   const { openItem } = useClickGuard();
 *   openItem({ type: "listing", data: { title, price, ... } });
 *
 * Place once per page, outside the section grid:
 *   <>
 *     <ClickGuardProvider>{sections}</ClickGuardProvider>
 *     <InlineOverview onInstall={() => router.push("/builder")} />
 *   </>
 */

import { useEffect, type ReactNode } from "react";
import { useClickGuard, type ClickGuardItem } from "./click-guard";
import { useRenderMode } from "../runtime-context";

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function OverlayBackdrop({ onClose }: { onClose: () => void }) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px]"
      onClick={onClose}
    />
  );
}

function PanelRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5 border-b border-[color:var(--pk-border,#e2e8f0)] last:border-0">
      <span className="text-xs uppercase tracking-[0.22em] text-[color:var(--pk-muted-foreground,#64748b)]">
        {label}
      </span>
      <span className="text-sm font-medium text-[color:var(--pk-foreground,#0f172a)] text-right">
        {value}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Item renderers
// ---------------------------------------------------------------------------

function ListingOverview({
  data,
  isTemplateMode,
  onInstall,
}: {
  data: Record<string, unknown>;
  isTemplateMode: boolean;
  onInstall?: () => void;
}) {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--pk-primary,#0f172a)] mb-3">
        Property
      </p>
      <p className="text-lg font-semibold text-[color:var(--pk-foreground,#0f172a)] mb-4 leading-tight">
        {String(data.title ?? "Property")}
      </p>
      {data.location ? <PanelRow label="Location" value={String(data.location)} /> : null}
      {data.price ? <PanelRow label="Price" value={String(data.price)} /> : null}
      {data.specs ? <PanelRow label="Details" value={String(data.specs)} /> : null}
      <div className="mt-5">
        {isTemplateMode ? (
          <button
            className="w-full rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            onClick={onInstall}
            type="button"
          >
            Install this template
          </button>
        ) : (
          <a
            className="block w-full rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-4 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
            href={`/listings/${String(data.slug ?? data.id ?? "")}`}
          >
            View property
          </a>
        )}
      </div>
    </>
  );
}

function AgentOverview({
  data,
  isTemplateMode,
  onInstall,
}: {
  data: Record<string, unknown>;
  isTemplateMode: boolean;
  onInstall?: () => void;
}) {
  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--pk-primary,#0f172a)] mb-3">
        Agent
      </p>
      <p className="text-lg font-semibold text-[color:var(--pk-foreground,#0f172a)] mb-1 leading-tight">
        {String(data.name ?? "Agent")}
      </p>
      {data.role ?? data.title ? (
        <p className="text-sm text-[color:var(--pk-muted-foreground,#64748b)] mb-4">
          {String(data.role ?? data.title ?? "")}
        </p>
      ) : null}
      {data.bio ? (
        <p className="text-sm leading-relaxed text-[color:var(--pk-foreground,#0f172a)] mb-4">
          {String(data.bio)}
        </p>
      ) : null}
      <div className="mt-5">
        {isTemplateMode ? (
          <button
            className="w-full rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            onClick={onInstall}
            type="button"
          >
            Install this template
          </button>
        ) : (
          <a
            className="block w-full rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-4 py-2.5 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
            href={`/agents/${String(data.slug ?? data.id ?? "")}`}
          >
            View profile
          </a>
        )}
      </div>
    </>
  );
}

function GenericOverview({
  item,
  isTemplateMode,
  onInstall,
}: {
  item: ClickGuardItem;
  isTemplateMode: boolean;
  onInstall?: () => void;
}) {
  const label = item.type.charAt(0).toUpperCase() + item.type.slice(1);
  const name =
    String(item.data.title ?? item.data.name ?? item.data.heading ?? label);

  return (
    <>
      <p className="text-xs uppercase tracking-[0.3em] text-[color:var(--pk-primary,#0f172a)] mb-3">
        {label}
      </p>
      <p className="text-lg font-semibold text-[color:var(--pk-foreground,#0f172a)] mb-4 leading-tight">
        {name}
      </p>
      {isTemplateMode ? (
        <button
          className="mt-2 w-full rounded-lg bg-[color:var(--pk-primary,#0f172a)] px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          onClick={onInstall}
          type="button"
        >
          Install this template
        </button>
      ) : null}
    </>
  );
}

// ---------------------------------------------------------------------------
// Panel shell
// ---------------------------------------------------------------------------

function Panel({ children, onClose }: { children: ReactNode; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <>
      <OverlayBackdrop onClose={onClose} />
      <div
        className="fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-2xl bg-white p-6 shadow-2xl md:bottom-8 md:left-1/2 md:-translate-x-1/2 md:rounded-2xl"
        role="dialog"
        aria-modal="true"
      >
        <button
          aria-label="Close"
          className="absolute right-4 top-4 flex size-7 items-center justify-center rounded-full bg-[color:var(--pk-muted,#f1f5f9)] text-[color:var(--pk-muted-foreground,#64748b)] transition-colors hover:bg-[color:var(--pk-muted,#e2e8f0)]"
          onClick={onClose}
          type="button"
        >
          ✕
        </button>
        {children}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// InlineOverview — public component
// ---------------------------------------------------------------------------

export type InlineOverviewProps = {
  /** Called when "Install this template" CTA is clicked in template mode. */
  onInstall?: () => void;
};

export function InlineOverview({ onInstall }: InlineOverviewProps) {
  const { activeItem, closeItem } = useClickGuard();
  const renderMode = useRenderMode();

  if (!activeItem) return null;

  const isTemplateMode = renderMode === "template";

  return (
    <Panel onClose={closeItem}>
      {activeItem.type === "listing" ? (
        <ListingOverview
          data={activeItem.data}
          isTemplateMode={isTemplateMode}
          onInstall={onInstall}
        />
      ) : activeItem.type === "agent" ? (
        <AgentOverview
          data={activeItem.data}
          isTemplateMode={isTemplateMode}
          onInstall={onInstall}
        />
      ) : (
        <GenericOverview
          item={activeItem}
          isTemplateMode={isTemplateMode}
          onInstall={onInstall}
        />
      )}
    </Panel>
  );
}
