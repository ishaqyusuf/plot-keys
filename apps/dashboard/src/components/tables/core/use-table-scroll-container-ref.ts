"use client";

import type { MutableRefObject } from "react";
import { useCallback } from "react";

import type { TableScrollState } from "./types";

type UseTableScrollContainerRefOptions = {
  parentRef: MutableRefObject<HTMLDivElement | null>;
  tableScroll: Pick<TableScrollState, "containerRef">;
};

export function useTableScrollContainerRef({
  parentRef,
  tableScroll,
}: UseTableScrollContainerRefOptions) {
  return useCallback(
    (element: HTMLDivElement | null) => {
      parentRef.current = element;
      (
        tableScroll.containerRef as MutableRefObject<HTMLDivElement | null>
      ).current = element;
    },
    [parentRef, tableScroll.containerRef],
  );
}
