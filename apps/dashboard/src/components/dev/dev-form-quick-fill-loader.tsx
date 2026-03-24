"use client";

import { DevFormQuickFillFab } from "./dev-form-quick-fill-fab";

export function DevFormQuickFillLoader() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  return <DevFormQuickFillFab />;
}
