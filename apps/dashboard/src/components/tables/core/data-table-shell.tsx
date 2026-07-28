"use client";

import { AnimatePresence } from "framer-motion";
import type { ReactNode, RefCallback } from "react";
import { BottomBar } from "./bottom-bar";

export type CoreDataTableShellRuntime = {
  onDeselect: () => void;
  scrollRef: RefCallback<HTMLDivElement>;
  selectedCount: number;
};

type Props = {
  bottomBar?: ReactNode;
  children: ReactNode;
  runtime: CoreDataTableShellRuntime;
};

export function CoreDataTableShell({ bottomBar, children, runtime }: Props) {
  const { onDeselect, scrollRef, selectedCount } = runtime;
  const showBottomBar = selectedCount > 0;

  return (
    <div className="relative">
      <div className="w-full">
        <div
          className="overflow-auto overscroll-contain border-l border-r border-b border-border scrollbar-hide"
          ref={scrollRef}
          style={{
            height: "calc(100vh - 350px + var(--header-offset, 0px))",
          }}
        >
          {children}
          <div
            style={{ height: "var(--header-offset, 0px)", flexShrink: 0 }}
            aria-hidden
          />
        </div>
      </div>

      <AnimatePresence>
        {showBottomBar && bottomBar ? (
          <BottomBar onDeselect={onDeselect} selectedCount={selectedCount}>
            {bottomBar}
          </BottomBar>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
