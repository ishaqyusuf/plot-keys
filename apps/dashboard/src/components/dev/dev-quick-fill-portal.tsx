"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export const DEV_QUICK_FILL_SLOT_ID = "dev-quick-fill-slot";

type DevQuickFillPortalProps = {
  children: ReactNode;
  fallback?: "hidden" | "inline";
};

export function DevQuickFillPortal({
  children,
  fallback = "hidden",
}: DevQuickFillPortalProps) {
  const [target, setTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setTarget(document.getElementById(DEV_QUICK_FILL_SLOT_ID));
  }, []);

  if (target) {
    return createPortal(children, target);
  }

  if (fallback === "inline") {
    return <>{children}</>;
  }

  return null;
}
