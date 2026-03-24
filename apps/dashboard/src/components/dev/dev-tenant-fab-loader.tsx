"use client";

import dynamic from "next/dynamic";

const DevTenantFab =
  process.env.NODE_ENV === "development"
    ? dynamic(
        () => import("./dev-tenant-fab").then((m) => m.DevTenantFab),
        { ssr: false },
      )
    : null;

export function DevTenantFabLoader() {
  if (!DevTenantFab) {
    return null;
  }

  return <DevTenantFab />;
}
