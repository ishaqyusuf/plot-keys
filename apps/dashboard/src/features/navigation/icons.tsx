"use client";

import type { IconName } from "@plotkeys/app-store/registry";
import { RegistryIcon } from "@plotkeys/app-store/registry/icon-map";

function makeRegistryIcon(name: IconName) {
  return function PlotKeysNavIcon({ className }: { className?: string }) {
    return <RegistryIcon name={name} className={className} />;
  };
}

export const iconFor = makeRegistryIcon;
