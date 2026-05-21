"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

import type {
  InferQueryParamSchema,
  QueryParamSchema,
  SetQueryFilters,
} from "./filter-query-loader";

export function useQueryFilterStates<TSchema extends QueryParamSchema>(
  schema: TSchema,
) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const schemaKeys = useMemo(() => Object.keys(schema), [schema]);

  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(schema).map(([key, parser]) => [
          key,
          parser.parse(searchParams.get(key)),
        ]),
      ) as InferQueryParamSchema<TSchema>,
    [schema, searchParams],
  );

  const setFilters: SetQueryFilters<TSchema> = useCallback(
    (next) => {
      const params = new URLSearchParams(searchParams.toString());

      if (next === null) {
        for (const key of schemaKeys) {
          params.delete(key);
        }
      } else {
        for (const [key, value] of Object.entries(next)) {
          const parser = schema[key];

          if (
            !parser ||
            value === null ||
            value === undefined ||
            value === "" ||
            Array.isArray(value)
          ) {
            params.delete(key);
            continue;
          }

          params.set(key, parser.serialize(value));
        }
      }

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router, schema, schemaKeys, searchParams],
  );

  return [filters, setFilters] as const;
}
