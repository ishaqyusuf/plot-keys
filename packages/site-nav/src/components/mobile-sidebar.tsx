"use client";

import { Button } from "@plotkeys/ui/button";
import { Icon } from "@plotkeys/ui/icons";
import { PlotKeysLogo } from "@plotkeys/ui/plotkeys-logo";
import { Sheet, SheetContent } from "@plotkeys/ui/sheet";
import { useState } from "react";
import { NavsList } from "./navs-list";
import { useSiteNav } from "./use-site-nav";

export function MobileSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { linkModules } = useSiteNav();

  if (linkModules.noSidebar) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div>
        <Button
          aria-label="Open navigation"
          variant="outline"
          size="icon"
          onClick={() => setIsOpen(true)}
          className="rounded-full w-8 h-8 items-center relative flex md:hidden"
          type="button"
        >
          <Icon.Menu className="size-4" />
        </Button>
      </div>
      <SheetContent
        side="left"
        className="border-none rounded-none -ml-4"
        title="Navigation"
      >
        <div className="ml-2 mb-8">
          <PlotKeysLogo markClassName="h-6" showWordmark={false} />
        </div>

        <div className="-ml-2">
          <NavsList mobile onSelect={() => setIsOpen(false)} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
