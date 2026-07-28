"use client";

import { cn } from "@plotkeys/ui/cn";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon, type IconName } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { DateRangeFilter } from "../date-range-filter";
import { FilterList } from "./filter-list";
import { getSearchKey, isSearchKey, searchIcons } from "./search-utils";
import type {
  FilterState,
  FilterValue,
  PageFilterData,
  SetFilters,
} from "./types";

type Props = {
  filterList: PageFilterData[];
  filters: FilterState;
  placeholder?: string;
  setFilters: SetFilters;
};

type FilterMenuItemInput = {
  children: ReactNode;
  icon: IconName;
  label: string;
};

type FilterCheckboxItemInput = {
  checked?: boolean;
  label: string;
  onCheckedChange: () => void;
};

function FilterMenuItem({ children, icon, label }: FilterMenuItemInput) {
  const FilterIcon = Icon[icon] ?? Icon.Search;

  return (
    <DropdownMenuGroup>
      <DropdownMenuSub>
        <DropdownMenuSubTrigger>
          <FilterIcon className="mr-2 size-4" />
          <span className="capitalize">{label}</span>
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent
            sideOffset={14}
            alignOffset={-4}
            className="p-0"
          >
            {children}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    </DropdownMenuGroup>
  );
}

function FilterCheckboxItem({
  checked = false,
  label,
  onCheckedChange,
}: FilterCheckboxItemInput) {
  return (
    <DropdownMenuCheckboxItem
      onSelect={(event) => event.preventDefault()}
      onCheckedChange={onCheckedChange}
      checked={checked}
    >
      {label}
    </DropdownMenuCheckboxItem>
  );
}

function isFilled(value: FilterValue) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

function getDateRangeEndKey(filter: PageFilterData) {
  return (
    filter.endValue ?? (filter.value === "start" ? "end" : `${filter.value}End`)
  );
}

function getStringFilterValue(value: FilterValue) {
  return typeof value === "string" ? value : null;
}

function updateArrayFilter(value: string, currentValues: FilterValue) {
  const normalizedValues = Array.isArray(currentValues) ? currentValues : [];
  const nextValues = normalizedValues.includes(value)
    ? normalizedValues.filter((item) => item !== value)
    : [...normalizedValues, value];

  return nextValues.length > 0 ? nextValues : null;
}

export function SearchFilter({
  filterList,
  filters,
  placeholder = "Search...",
  setFilters,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchKey = getSearchKey(filters) ?? "q";
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState(
    typeof filters[searchKey] === "string" ? filters[searchKey] : "",
  );
  const menuFilters = filterList.filter((filter) => !isSearchKey(filter.value));
  const hasMenuFilters = menuFilters.length > 0;
  const validFilters = Object.fromEntries(
    menuFilters.flatMap((filter) => {
      const entries: [string, FilterValue][] = [
        [filter.value, filters[filter.value]],
      ];

      if (filter.type === "date-range") {
        const endKey = getDateRangeEndKey(filter);
        entries.push([endKey, filters[endKey]]);
      }

      return entries;
    }),
  );

  useEffect(() => {
    setPrompt(typeof filters[searchKey] === "string" ? filters[searchKey] : "");
  }, [filters, searchKey]);

  useHotkeys(
    "esc",
    () => {
      setPrompt("");
      setFilters(null);
      setIsOpen(false);
    },
    {
      enableOnFormTags: true,
      enabled: Boolean(prompt),
    },
  );

  useHotkeys("meta+s", (event) => {
    event.preventDefault();
    inputRef.current?.focus();
  });

  function handleSearch(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    if (value) {
      setPrompt(value);
    } else {
      setFilters(null);
      setPrompt("");
    }
  }

  function handleSubmit(event?: React.FormEvent) {
    event?.preventDefault();
    setFilters({ [searchKey]: prompt.length > 0 ? prompt : null });
  }

  const hasValidFilters = Object.values(validFilters).some((value) =>
    isFilled(value),
  );

  function optionSelected(filter: PageFilterData, value: string) {
    const current = filters[filter.value];

    if (filter.type === "checkbox" || Array.isArray(current)) {
      setFilters({ [filter.value]: updateArrayFilter(value, current) });
      return;
    }

    setFilters({ [filter.value]: value });
  }

  function isOptionSelected(filter: PageFilterData, value: string) {
    const current = filters[filter.value];

    if (Array.isArray(current)) {
      return current.includes(value);
    }

    return current === value;
  }

  return (
    <DropdownMenu
      open={hasMenuFilters ? isOpen : false}
      onOpenChange={setIsOpen}
    >
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 items-start sm:items-center w-full">
        <form
          className="relative w-full sm:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <Icon.Search className="absolute pointer-events-none left-3 top-[11px]" />
          <Input
            ref={inputRef}
            placeholder={placeholder}
            className={cn(
              "pl-9 w-full sm:w-[350px]",
              hasMenuFilters ? "pr-8" : "pr-3",
            )}
            value={prompt}
            onChange={handleSearch}
            autoComplete="off"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
          />
          {hasMenuFilters ? (
            <DropdownMenuTrigger asChild>
              <button
                onClick={() => setIsOpen((current) => !current)}
                type="button"
                className={cn(
                  "absolute z-10 right-3 top-[10px] opacity-50 transition-opacity duration-300 hover:opacity-100",
                  hasValidFilters && "opacity-100",
                  isOpen && "opacity-100",
                )}
              >
                <Icon.Filter />
              </button>
            </DropdownMenuTrigger>
          ) : null}
        </form>

        <FilterList
          filterList={menuFilters}
          filters={validFilters}
          onRemove={(next) => {
            setFilters(next);
          }}
        />
      </div>

      {hasMenuFilters ? (
        <DropdownMenuContent
          className="w-[350px]"
          sideOffset={19}
          alignOffset={-11}
          side="bottom"
          align="end"
        >
          {menuFilters.map((filter) => {
            const icon = searchIcons[filter.value] ?? "Search";
            const label = filter.label || filter.value.split(".").join(" ");

            return (
              <FilterMenuItem icon={icon} key={filter.value} label={label}>
                {filter.type === "date-range" ? (
                  <DateRangeFilter
                    start={getStringFilterValue(filters[filter.value])}
                    end={getStringFilterValue(
                      filters[getDateRangeEndKey(filter)],
                    )}
                    onSelect={(range) => {
                      setFilters({
                        [filter.value]: range.start,
                        [getDateRangeEndKey(filter)]: range.end,
                      });
                    }}
                  />
                ) : (
                  <div className="max-h-72 min-w-48 overflow-y-auto p-1">
                    {filter.options?.length ? (
                      filter.options.map(({ label, value }) => (
                        <FilterCheckboxItem
                          checked={isOptionSelected(filter, value)}
                          key={value}
                          label={label}
                          onCheckedChange={() => optionSelected(filter, value)}
                        />
                      ))
                    ) : (
                      <DropdownMenuItem disabled>
                        No options found
                      </DropdownMenuItem>
                    )}
                  </div>
                )}
              </FilterMenuItem>
            );
          })}
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
}
