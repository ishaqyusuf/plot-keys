export type ListCursor = string | null;

export type PaginatedListMeta = {
  count: number;
  cursor: ListCursor;
  hasNextPage: boolean;
  size: number;
};

export type PaginatedListResult<T> = {
  data: T[];
  meta: PaginatedListMeta;
};

export type ListPageSizeOptions = {
  defaultSize?: number;
  maxSize?: number;
  minSize?: number;
};

export function normalizeListPageSize(
  size: string | number | null | undefined,
  {
    defaultSize = 50,
    maxSize = 100,
    minSize = 1,
  }: ListPageSizeOptions = {},
) {
  const value = Number(size ?? defaultSize);

  if (!Number.isFinite(value)) {
    return defaultSize;
  }

  return Math.min(Math.max(Math.trunc(value), minSize), maxSize);
}

export function normalizeListOffsetCursor(
  cursor: string | number | null | undefined,
) {
  const value = Number(cursor ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(Math.trunc(value), 0);
}

export function createPaginatedListMeta({
  count,
  offset,
  size,
}: {
  count: number;
  offset: number;
  size: number;
}): PaginatedListMeta {
  const nextCursor = offset + size < count ? String(offset + size) : null;

  return {
    count,
    cursor: nextCursor,
    hasNextPage: nextCursor !== null,
    size,
  };
}

export function createPaginatedListResult<T>(
  data: T[],
  input: {
    count: number;
    offset: number;
    size: number;
  },
): PaginatedListResult<T> {
  return {
    data,
    meta: createPaginatedListMeta(input),
  };
}
