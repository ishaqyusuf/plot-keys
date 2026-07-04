"use client";

import { Spinner } from "../../spinner";

type DataTableLoadMoreProps = {
  hasNextPage?: boolean;
  loadMoreRef?: ((node?: Element | null) => void) | null;
};

export function DataTableLoadMore({
  hasNextPage,
  loadMoreRef,
}: DataTableLoadMoreProps) {
  if (!loadMoreRef) {
    return null;
  }

  return (
    <div className="flex h-12 items-center justify-center" ref={loadMoreRef}>
      {hasNextPage ? (
        <Spinner className="size-4 text-muted-foreground" />
      ) : null}
    </div>
  );
}
