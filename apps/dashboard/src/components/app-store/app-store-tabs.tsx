"use client";

import { cn } from "@plotkeys/ui/cn";
import { Tabs, TabsList, TabsTrigger } from "@plotkeys/ui/tabs";
import { useQueryState } from "nuqs";
import {
  activeHeaderTabStateClassName,
  headerTabClassName,
  headerTabListClassName,
  inactiveHeaderTabClassName,
} from "@/components/header-link-tab";

export function AppStoreTabs() {
  const [currentTab, setTab] = useQueryState("tab", {
    defaultValue: "all",
  });

  return (
    <Tabs value={currentTab ?? "all"} onValueChange={setTab}>
      <div className={headerTabListClassName}>
        <TabsList className="flex items-stretch h-auto p-0 bg-transparent">
          <TabsTrigger
            value="all"
            className={cn(
              headerTabClassName,
              inactiveHeaderTabClassName,
              activeHeaderTabStateClassName,
            )}
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="installed"
            className={cn(
              headerTabClassName,
              inactiveHeaderTabClassName,
              activeHeaderTabStateClassName,
            )}
          >
            Installed
          </TabsTrigger>
        </TabsList>
      </div>
    </Tabs>
  );
}
