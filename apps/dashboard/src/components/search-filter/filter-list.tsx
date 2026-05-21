"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { Skeleton } from "@plotkeys/ui/skeleton";

import type { PageFilterData } from "./types";
import { isSearchKey } from "./search-utils";

type FilterValue = boolean | string | string[] | null | undefined;

type FilterListProps = {
  filterList: PageFilterData[];
  filters: Record<string, FilterValue>;
  loading?: boolean;
  onClearAll?: () => void;
  onRemove?: (next: Record<string, FilterValue>) => void;
};

function isFilled(value: FilterValue) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

function renderFilterValue(
  key: string,
  value: FilterValue,
  filterList: PageFilterData[],
) {
  if (isSearchKey(key)) return value;

  const definition = filterList.find((filter) => filter.value === key);
  const options = definition?.options;

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (!Array.isArray(value)) {
    return (
      options?.find((option) => String(option.value) === String(value))?.label ??
      value
    );
  }

  return value
    .map(
      (item) =>
        options?.find((option) => String(option.value) === String(item))?.label ??
        item,
    )
    .join(", ");
}

export function FilterList({
  filterList,
  filters,
  loading,
  onClearAll,
  onRemove,
}: FilterListProps) {
  const activeEntries = Object.entries(filters || {}).filter(([, value]) =>
    isFilled(value),
  );

  return (
    <div className="w-full min-w-0 overflow-x-auto pb-1">
      <ul className="flex w-max min-w-full gap-2 lg:min-w-0 lg:flex-wrap">
        {loading ? (
          <div className="flex gap-2">
            <li>
              <Skeleton className="h-8 w-[100px] rounded-full" />
            </li>
            <li>
              <Skeleton className="h-8 w-[100px] rounded-full" />
            </li>
          </div>
        ) : null}

        {!loading
          ? activeEntries.map(([key, value]) => (
              <li key={key}>
                <Button
                  className="group flex h-8 shrink-0 items-center space-x-1 rounded-full bg-secondary px-3 font-normal text-[#878787] hover:bg-secondary"
                  onClick={() => onRemove?.({ [key]: null })}
                  type="button"
                  variant="secondary"
                >
                  <Icon.Close className="w-0 scale-0 transition-all group-hover:w-4 group-hover:scale-100" />
                  <span>{renderFilterValue(key, value, filterList)}</span>
                </Button>
              </li>
            ))
          : null}

        {!loading && activeEntries.length > 0 ? (
          <li>
            <Button
              className="flex h-8 shrink-0 items-center rounded-full bg-secondary px-3 font-normal text-[#878787] hover:bg-secondary"
              onClick={onClearAll}
              type="button"
              variant="secondary"
            >
              Clear filters
            </Button>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
