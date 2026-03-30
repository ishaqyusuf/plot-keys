"use client";

import { type KeyboardEvent, type MouseEvent, useCallback } from "react";

import { type ClickGuardItemType, useClickGuard } from "../runtime/click-guard";
import { useRenderMode } from "../runtime-context";

type OverviewData = Record<string, unknown>;

type InteractiveCardProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLElement>) => void;
  role?: "button";
  tabIndex?: number;
};

type InteractiveLinkProps = {
  onClick?: (event: MouseEvent<HTMLElement>) => void;
};

export function useItemOverviewTrigger() {
  const { openItem } = useClickGuard();
  const renderMode = useRenderMode();
  const isOverviewMode = renderMode !== "live";

  const openOverview = useCallback(
    (type: ClickGuardItemType, data: OverviewData) => {
      if (!isOverviewMode) return false;
      openItem({ type, data });
      return true;
    },
    [isOverviewMode, openItem],
  );

  const getCardProps = useCallback(
    (type: ClickGuardItemType, data: OverviewData): InteractiveCardProps =>
      isOverviewMode
        ? {
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              openItem({ type, data });
            },
            onKeyDown: (event) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              event.stopPropagation();
              openItem({ type, data });
            },
            role: "button",
            tabIndex: 0,
          }
        : {},
    [isOverviewMode, openItem],
  );

  const getLinkProps = useCallback(
    (type: ClickGuardItemType, data: OverviewData): InteractiveLinkProps =>
      isOverviewMode
        ? {
            onClick: (event) => {
              event.preventDefault();
              event.stopPropagation();
              openItem({ type, data });
            },
          }
        : {},
    [isOverviewMode, openItem],
  );

  return {
    getCardProps,
    getLinkProps,
    isOverviewMode,
    openOverview,
  };
}
