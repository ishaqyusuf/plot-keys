import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";

import type { PageFilterData } from "./types";

type FilterValue = boolean | string | string[] | null | undefined;

type FilterListProps = {
  filterList: PageFilterData[];
  filters: Record<string, FilterValue>;
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
  onRemove,
}: FilterListProps) {
  const activeEntries = filterList
    .map((filter) => [filter.value, filters?.[filter.value]] as const)
    .filter(([, value]) => isFilled(value));

  return (
    <ul className="flex space-x-2">
      {activeEntries.map(([key, value]) => (
        <li key={key}>
          <Button
            className="h-9 px-2 bg-secondary hover:bg-secondary font-normal text-[#878787] flex space-x-1 items-center group rounded-none"
            onClick={() => onRemove?.({ [key]: null })}
          >
            <Icon.Close className="scale-0 group-hover:scale-100 transition-all w-0 group-hover:w-4" />
            <span>{renderFilterValue(key, value, filterList)}</span>
          </Button>
        </li>
      ))}
    </ul>
  );
}
