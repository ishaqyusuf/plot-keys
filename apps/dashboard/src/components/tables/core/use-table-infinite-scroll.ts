"use client";

import type { Virtualizer } from "@tanstack/react-virtual";
import { type RefObject, useCallback } from "react";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";

type UseTableInfiniteScrollProps<
  TScrollElement extends HTMLElement = HTMLDivElement,
> = {
  fetchNextPage: () => unknown;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  rowCount: number;
  rowVirtualizer: Virtualizer<TScrollElement, Element>;
  scrollRef: RefObject<TScrollElement | null>;
  threshold?: number;
};

export function useTableInfiniteScroll<
  TScrollElement extends HTMLElement = HTMLDivElement,
>({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  rowCount,
  rowVirtualizer,
  scrollRef,
  threshold = 20,
}: UseTableInfiniteScrollProps<TScrollElement>) {
  const loadMore = useCallback(() => {
    fetchNextPage();
  }, [fetchNextPage]);

  useInfiniteScroll<TScrollElement>({
    fetchNextPage: loadMore,
    hasNextPage,
    isFetchingNextPage,
    rowCount,
    rowVirtualizer,
    scrollRef,
    threshold,
  });
}
