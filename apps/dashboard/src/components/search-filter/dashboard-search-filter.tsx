"use client";

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
import { cn } from "@plotkeys/utils";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { FilterList } from "./filter-list";
import { getSearchKey, isSearchKey, searchIcons } from "./search-utils";
import type {
  FilterState,
  FilterValue,
  PageFilterData,
  SetFilters,
} from "./types";

type DashboardSearchFilterProps = {
  filterList: PageFilterData[];
  filters: FilterState;
  placeholder?: string;
  setFilters: SetFilters;
};

type FilterMenuItemProps = {
  children: ReactNode;
  icon: IconName;
  label: string;
};

type FilterCheckboxItemProps = {
  checked?: boolean;
  label: string;
  onCheckedChange: () => void;
};

function FilterMenuItem({ children, icon, label }: FilterMenuItemProps) {
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
            alignOffset={-4}
            className="p-0"
            sideOffset={14}
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
}: FilterCheckboxItemProps) {
  return (
    <DropdownMenuCheckboxItem
      checked={checked}
      onCheckedChange={onCheckedChange}
      onSelect={(event) => event.preventDefault()}
    >
      {label}
    </DropdownMenuCheckboxItem>
  );
}

function isFilled(value: FilterValue) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
}

function updateArrayFilter(value: string, currentValues: FilterValue) {
  const normalizedValues = Array.isArray(currentValues) ? currentValues : [];
  const nextValues = normalizedValues.includes(value)
    ? normalizedValues.filter((item) => item !== value)
    : [...normalizedValues, value];

  return nextValues.length > 0 ? nextValues : null;
}

export function DashboardSearchFilter({
  filterList,
  filters,
  placeholder = "Search...",
  setFilters,
}: DashboardSearchFilterProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const searchKey = getSearchKey(filters) ?? "q";
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [prompt, setPrompt] = useState(
    typeof filters[searchKey] === "string" ? filters[searchKey] : "",
  );
  const menuFilters = filterList.filter((filter) => !isSearchKey(filter.value));
  const hasMenuFilters = menuFilters.length > 0;
  const validFilters = Object.fromEntries(
    menuFilters.map((filter) => [filter.value, filters[filter.value]]),
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
      enabled: Boolean(prompt) && isFocused,
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
      setFilters({ [searchKey]: null });
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
      onOpenChange={setIsOpen}
      open={hasMenuFilters ? isOpen : false}
    >
      <div className="flex w-full flex-col items-stretch space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0 md:w-auto">
        <form className="relative w-full sm:w-auto" onSubmit={handleSubmit}>
          <Icon.Search className="pointer-events-none absolute left-3 top-[11px] size-4" />
          <Input
            ref={inputRef}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className={cn(
              "w-full pl-9 sm:w-[350px]",
              hasMenuFilters ? "pr-8" : "pr-3",
            )}
            onBlur={() => setIsFocused(false)}
            onChange={handleSearch}
            onFocus={() => setIsFocused(true)}
            placeholder={placeholder}
            spellCheck={false}
            value={prompt}
          />
          {hasMenuFilters ? (
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "absolute right-3 top-[10px] z-10 opacity-50 transition-opacity duration-300 hover:opacity-100",
                  hasValidFilters && "opacity-100",
                  isOpen && "opacity-100",
                )}
                onClick={() => setIsOpen((current) => !current)}
                type="button"
              >
                <Icon.Filter className="size-4" />
                <span className="sr-only">Open filters</span>
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
          align="end"
          alignOffset={-11}
          className="w-[350px]"
          side="bottom"
          sideOffset={19}
        >
          {menuFilters.map((filter) => {
            const icon = searchIcons[filter.value] ?? "Search";
            const label = filter.label || filter.value.split(".").join(" ");

            return (
              <FilterMenuItem icon={icon} key={filter.value} label={label}>
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
                    <DropdownMenuItem disabled>No options found</DropdownMenuItem>
                  )}
                </div>
              </FilterMenuItem>
            );
          })}
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
}
