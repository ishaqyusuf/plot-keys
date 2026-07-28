import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { format, parseISO } from "date-fns";
import { formatDateRange } from "little-date";

import type { PageFilterData } from "./types";

type FilterValue = boolean | string | string[] | null | undefined;

type Props = {
  filterList: PageFilterData[];
  filters: Record<string, FilterValue>;
  onRemove?: (next: Record<string, FilterValue>) => void;
};

function isFilled(value: FilterValue) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

function getDateRangeEndKey(filter: PageFilterData) {
  return (
    filter.endValue ?? (filter.value === "start" ? "end" : `${filter.value}End`)
  );
}

function formatDateValue(value: string) {
  return format(parseISO(value), "MMM d, yyyy");
}

function formatDateRangeValue(start: string, end?: FilterValue) {
  if (typeof end === "string" && end) {
    return formatDateRange(parseISO(start), parseISO(end), {
      includeTime: false,
    });
  }

  return formatDateValue(start);
}

function renderFilterValue(
  key: string,
  value: FilterValue,
  filters: Record<string, FilterValue>,
  filterList: PageFilterData[],
) {
  const definition = filterList.find((filter) => filter.value === key);
  const options = definition?.options;

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (definition?.type === "date-range" && typeof value === "string" && value) {
    return formatDateRangeValue(value, filters[getDateRangeEndKey(definition)]);
  }

  if (!Array.isArray(value)) {
    return (
      options?.find((option) => String(option.value) === String(value))
        ?.label ?? value
    );
  }

  return value
    .map(
      (item) =>
        options?.find((option) => String(option.value) === String(item))
          ?.label ?? item,
    )
    .join(", ");
}

export function FilterList({ filterList, filters, onRemove }: Props) {
  const activeEntries = filterList
    .map((filter) => [filter, filters?.[filter.value]] as const)
    .filter(([, value]) => isFilled(value));

  return (
    <ul className="flex space-x-2">
      {activeEntries.map(([filter, value]) => (
        <li key={filter.value}>
          <Button
            className="h-9 px-2 bg-secondary hover:bg-secondary font-normal text-muted-foreground flex space-x-1 items-center group rounded-none"
            onClick={() => {
              if (filter.type === "date-range") {
                onRemove?.({
                  [filter.value]: null,
                  [getDateRangeEndKey(filter)]: null,
                });
                return;
              }

              onRemove?.({ [filter.value]: null });
            }}
          >
            <Icon.Clear className="scale-0 group-hover:scale-100 transition-all w-0 group-hover:w-4" />
            <span>
              {renderFilterValue(filter.value, value, filters, filterList)}
            </span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
