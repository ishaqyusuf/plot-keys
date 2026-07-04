"use client";

import { useCallback, useRef } from "react";

export function useTableScroll() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToColumn = useCallback((index: number) => {
    const container = containerRef.current;
    const cell = container?.querySelector<HTMLElement>(
      `[data-column-index="${index}"]`,
    );

    if (!container || !cell) {
      return;
    }

    container.scrollTo({
      behavior: "smooth",
      left: cell.offsetLeft - 16,
    });
  }, []);

  return { containerRef, scrollToColumn };
}
