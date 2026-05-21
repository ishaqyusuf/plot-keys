"use client";

import { Button } from "@plotkeys/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@plotkeys/ui/dropdown-menu";
import { Icon } from "@plotkeys/ui/icons";
import { Input } from "@plotkeys/ui/input";
import { cn } from "@plotkeys/utils";
import { useEffect, useMemo, useRef, useState } from "react";

import { FilterList } from "./filter-list";
import { getSearchKey, isSearchKey, searchIcons } from "./search-utils";
import type { FilterState, FilterValue, PageFilterData, SetFilters } from "./types";

type DashboardSearchFilterProps = {
  filterList: PageFilterData[];
  filters: FilterState;
  placeholder?: string;
  setFilters: SetFilters;
};

function isFilled(value: FilterValue) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== null && value !== undefined && value !== "";
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
  const [prompt, setPrompt] = useState(
    typeof filters[searchKey] === "string" ? filters[searchKey] : "",
  );

  useEffect(() => {
    setPrompt(typeof filters[searchKey] === "string" ? filters[searchKey] : "");
  }, [filters, searchKey]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (prompt || isOpen)) {
        event.preventDefault();
        setPrompt("");
        setFilters({ [searchKey]: null });
        setIsOpen(false);
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "s") {
        event.preventDefault();
        inputRef.current?.focus();
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "f") {
        event.preventDefault();
        setIsOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, prompt, searchKey, setFilters]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setFilters({ [searchKey]: prompt.length > 0 ? prompt : null });
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [prompt, searchKey, setFilters]);

  const hasValidFilters = useMemo(
    () =>
      Object.entries(filters).some(
        ([key, value]) => !isSearchKey(key) && isFilled(value),
      ),
    [filters],
  );

  const menuFilters = filterList.filter((filter) => !isSearchKey(filter.value));

  function optionSelected(filter: PageFilterData, value: string) {
    const current = filters[filter.value];

    setFilters({ [filter.value]: current === value ? null : value });
  }

  function isOptionSelected(filter: PageFilterData, value: string) {
    const current = filters[filter.value];

    if (Array.isArray(current)) {
      return current.includes(value);
    }

    return current === value;
  }

  function clearAllFilters() {
    const next = Object.fromEntries(
      Object.entries(filters)
        .filter(([, value]) => isFilled(value))
        .map(([key]) => [key, null]),
    );

    setFilters(next);
    setPrompt("");
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
        <form
          className="relative w-full lg:w-auto"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters({ [searchKey]: prompt.length > 0 ? prompt : null });
          }}
        >
          <Icon.Search className="pointer-events-none absolute left-3 top-[11px] size-4" />
          <Input
            ref={inputRef}
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            className="w-full pl-9 pr-24 lg:w-[350px] lg:pr-10"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder={placeholder}
            spellCheck={false}
            value={prompt}
          />
          <DropdownMenuTrigger asChild>
            <Button
              className={cn(
                "absolute right-1 top-1 z-10 h-8 gap-1.5 rounded-md px-2 text-muted-foreground opacity-70 transition-opacity duration-300 hover:opacity-100 lg:w-8 lg:px-0",
                hasValidFilters && "opacity-100",
                isOpen && "opacity-100",
              )}
              onClick={() => setIsOpen((current) => !current)}
              size="sm"
              type="button"
              variant="ghost"
            >
              <Icon.Settings2 className="size-4" />
              <span className="text-xs lg:hidden">Filters</span>
              <span className="sr-only">Open filters</span>
            </Button>
          </DropdownMenuTrigger>
        </form>

        <FilterList
          filterList={menuFilters}
          filters={filters}
          onClearAll={clearAllFilters}
          onRemove={(next) => {
            setFilters(next);
            if (Object.keys(next).some((key) => isSearchKey(key))) {
              setPrompt("");
            }
          }}
        />
      </div>

      <DropdownMenuContent
        align="end"
        alignOffset={-11}
        className="w-[min(22rem,calc(100vw-2rem))] lg:w-[350px]"
        side="bottom"
        sideOffset={19}
      >
        {menuFilters.map((filter) => {
          const FilterIcon = Icon[searchIcons[filter.value] ?? "Search"];

          return (
            <DropdownMenuGroup key={filter.value}>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <FilterIcon className="mr-2 size-4" />
                  <span className="capitalize">
                    {filter.label || filter.value.split(".").join(" ")}
                  </span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent
                    alignOffset={-4}
                    className="p-0"
                    sideOffset={14}
                  >
                    <div className="max-h-72 min-w-48 overflow-y-auto p-1">
                      {filter.options?.map(({ label, value }) => (
                        <DropdownMenuCheckboxItem
                          checked={isOptionSelected(filter, value)}
                          key={value}
                          onCheckedChange={() => optionSelected(filter, value)}
                        >
                          {label}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </div>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
