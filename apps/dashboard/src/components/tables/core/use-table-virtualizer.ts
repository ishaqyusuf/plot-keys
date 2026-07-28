"use client";

import { useVirtualizer } from "@tanstack/react-virtual";
import type { RefObject } from "react";

type UseTableVirtualizerProps<
  TScrollElement extends HTMLElement = HTMLDivElement,
> = {
  overscan?: number;
  rowCount: number;
  rowHeight: number;
  scrollRef: RefObject<TScrollElement | null>;
};

export function useTableVirtualizer<
  TScrollElement extends HTMLElement = HTMLDivElement,
>({
  overscan = 10,
  rowCount,
  rowHeight,
  scrollRef,
}: UseTableVirtualizerProps<TScrollElement>) {
  return useVirtualizer({
    count: rowCount,
    estimateSize: () => rowHeight,
    getScrollElement: () => scrollRef.current,
    overscan,
  });
}
