"use client";

import { useSiteNav } from "@plotkeys/site-nav";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@plotkeys/ui/command";
import { Icon } from "@plotkeys/ui/icons";
import { useMemo } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { useTenantRouter } from "@/components/nav/tenant-link";
import { useSearchStore } from "@/store/search";

export function Search() {
  const router = useTenantRouter();
  const { setOpen } = useSearchStore();
  const { modules } = useSiteNav();

  useHotkeys(
    "esc",
    () => {
      setOpen(false);
    },
    {
      enableOnFormTags: true,
    },
  );

  const results = useMemo(() => {
    const seen = new Set<string>();

    return modules.flatMap((module) =>
      module.sections.flatMap((section) =>
        section.links.flatMap((link) => {
          if (!link.show || !link.href || seen.has(link.href)) {
            return [];
          }

          seen.add(link.href);

          return [
            {
              href: link.href,
              icon: link.icon,
              label: link.title ?? link.name,
              module: module.title ?? module.name,
            },
          ];
        }),
      ),
    );
  }, [modules]);

  return (
    <Command className="search-container overflow-hidden p-0 relative w-full bg-background backdrop-filter backdrop-blur-lg dark:bg-background/[0.99] h-auto border border-border">
      <div className="border-b border-border relative">
        <CommandInput
          className="px-4 h-[55px] py-0"
          placeholder="Type a command or search..."
        />
      </div>

      <div className="px-2 global-search-list">
        <CommandList className="scrollbar-hide">
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            {results.map((result) => {
              const ResultIcon = result.icon ?? Icon.Search;

              return (
                <CommandItem
                  key={result.href}
                  value={`${result.label} ${result.module}`}
                  onSelect={() => {
                    setOpen(false);
                    router.push(result.href);
                  }}
                >
                  <ResultIcon className="mr-2 size-4" />
                  <span>{result.label}</span>
                  <span className="ml-auto text-xs text-muted-foreground">
                    {result.module}
                  </span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        </CommandList>
      </div>
    </Command>
  );
}
