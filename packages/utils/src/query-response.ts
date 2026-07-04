export type PageDataMeta = {
  count?: number;
  cursor?: string | null;
  page?: number;
  size?: number;
};

export type PaginationQuery = {
  bin?: boolean | null;
  cursor?: string | number | null;
  q?: string | null;
  size?: string | number | null;
  sort?: string[] | null;
};

type CountableModel = {
  count: (args?: any) => Promise<number>;
};

type QueryResponseOptions = {
  model?: CountableModel;
  query?: PaginationQuery | null;
  where?: Record<string, unknown>;
};

export async function queryResponse<TData>(
  data: TData,
  options: QueryResponseOptions,
) {
  const meta: PageDataMeta = {};
  const { model, query, where } = options;

  if (where && !query?.bin) {
    where.deletedAt = null;
  }

  if (model) {
    const count = await model.count({ where });
    const size = Number(query?.size || 20);
    const cursor = Number(query?.cursor || 0) + size;

    meta.count = count;
    meta.size = size;
    meta.cursor = cursor < count ? String(cursor) : null;
  }

  return { data, meta };
}

export function queryMeta(
  query: PaginationQuery = {},
  sortFn?: (sort: string, sortOrder: string) => unknown,
) {
  const take = Number(query.size || 20);
  const skip = Number(query.cursor || 0);
  const multiSorts = query.sort;
  const [sort = "createdAt", sortOrder = "desc"] = (
    query.sort?.[0] || "createdAt"
  ).split(".");

  let orderBy =
    multiSorts && multiSorts.length > 1
      ? multiSorts.map((sortItem) => {
          const [sortKey, order = "desc"] = sortItem.split(".");
          const key = sortKey || "createdAt";
          return sortFn?.(key, order) || { [key]: order };
        })
      : sortFn?.(sort, sortOrder) || { [sort]: sortOrder };

  if (Array.isArray(orderBy)) {
    orderBy = orderBy.flatMap((item) => (Array.isArray(item) ? item : [item]));
  }

  return { orderBy, skip, take };
}

export async function composeQueryData<TWhere extends Record<string, unknown>>(
  query: PaginationQuery,
  where: TWhere,
  model: CountableModel,
  props?: {
    sortFn?: (sort: string, sortOrder: string) => unknown;
  },
) {
  if (query?.bin) {
    (where as any).deletedAt = { lte: new Date() };
  }

  const metadata = await queryResponse([], { model, query, where });
  const searchMeta = queryMeta(query, props?.sortFn);

  function response<TData>(data: TData) {
    return {
      data,
      meta: metadata.meta,
      ...(process.env.NODE_ENV === "production"
        ? {}
        : { filter: where, query }),
    };
  }

  return {
    meta: metadata.meta,
    model,
    queryProps: { where, ...searchMeta },
    response,
    searchMeta,
    where,
  };
}

export function composeQuery(
  queries: Array<Record<string, unknown> | null | undefined | false>,
  relation: "AND" | "OR" = "AND",
) {
  const filtered = queries.filter(Boolean) as Record<string, unknown>[];

  if (filtered.length === 0) {
    return {};
  }

  if (filtered.length === 1) {
    return filtered[0] ?? {};
  }

  return { [relation]: filtered };
}
